import { Command } from "commander";
import {
  techcorWebApiRequirementsControllerIndex,
  techcorWebApiRequirementsControllerShow,
  techcorWebApiRequirementsControllerCreate,
  techcorWebApiRequirementsControllerUpdate,
  techcorWebApiRequirementsControllerAccept,
  techcorWebApiDesignControllerUpdate,
} from "../client/sdk.gen.js";
import { resolveOrgSlug } from "../api/index.js";
import { resolveProject } from "../config/index.js";
import { pollTask } from "../services/poller.js";
import { print, printList, fail } from "../output.js";
import type { Task, Requirement } from "../client/types.gen.js";

type ReqNode = { identifier: string; text: string; status: string; children: ReqNode[] };

function buildTree(items: Requirement[], root?: string): ReqNode[] {
  const nodes = new Map<string, ReqNode>();
  const active = items.filter((r) => r.status !== "rejected");
  const filtered = root
    ? active.filter(
        (r) => r.identifier === root || r.identifier.startsWith(root.replace(/\.0$/, "") + ".")
      )
    : active;

  for (const r of filtered) {
    nodes.set(r.identifier, { identifier: r.identifier, text: r.text ?? "", status: r.status ?? "", children: [] });
  }

  const roots: ReqNode[] = [];
  for (const r of filtered) {
    const node = nodes.get(r.identifier)!;
    const parts = r.identifier.split(".");
    if (parts.length === 2 && parts[1] === "0") {
      roots.push(node);
    } else {
      // For X.Y (depth 1 child), parent is X.0; for X.Y.Z+, parent is X.Y
      const parentId =
        parts.length === 2 ? `${parts[0]}.0` : parts.slice(0, -1).join(".");
      const parent = nodes.get(parentId);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    }
  }

  return roots;
}

export function requirementsCommand(): Command {
  const cmd = new Command("r").description("Manage requirements");

  cmd
    .command("list")
    .description("List all requirements for the project")
    .option("--project <slug>", "Project slug")
    .option("--tree", "Output as nested tree")
    .option("--root <identifier>", "Filter to subtree rooted at identifier (use with --tree)")
    .action(async (options) => {
      const org = await resolveOrgSlug();
      const project = resolveProject(options.project);
      const { data, error } = await techcorWebApiRequirementsControllerIndex({
        path: { org_slug: org, project_slug: project },
      });
      if (error) fail((error as { error: string }).error);
      if (options.tree) {
        const items = ((data as { data?: Requirement[] })?.data ?? []);
        console.log(JSON.stringify({ data: buildTree(items, options.root) }, null, 2));
      } else {
        printList(data);
      }
    });

  const showCmd = new Command("show")
    .argument("<identifier>")
    .description("Show a single requirement")
    .option("--project <slug>", "Project slug")
    .option("--include-children", "Inline one level of children into the response")
    .action(async (identifier, options) => {
      const org = await resolveOrgSlug();
      const project = resolveProject(options.project);
      const { data, error } = await techcorWebApiRequirementsControllerShow({
        path: { org_slug: org, project_slug: project, identifier },
      });
      if (error) fail((error as { error: string }).error);

      if (options.includeChildren) {
        const req = data as Requirement & { child_urls?: string[] };
        const childUrls = req.child_urls ?? [];
        const children = await Promise.all(
          childUrls.map(async (url) => {
            const childId = url.split("/").pop()!;
            const { data: child } = await techcorWebApiRequirementsControllerShow({
              path: { org_slug: org, project_slug: project, identifier: childId },
            });
            return child;
          })
        );
        print({ ...req, children });
      } else {
        print(data);
      }
    });
  cmd.addCommand(showCmd, { isDefault: true });

  cmd
    .command("create <text>")
    .description("Create a requirement")
    .option("--project <slug>", "Project slug")
    .option("--parent <identifier>", "Parent requirement identifier")
    .option("--context <text>", "Optional context")
    .action(async (text, options) => {
      const org = await resolveOrgSlug();
      const project = resolveProject(options.project);

      const { data: task, error } = await techcorWebApiRequirementsControllerCreate({
        path: { org_slug: org, project_slug: project },
        body: { text, parent_identifier: options.parent, context: options.context },
      });
      if (error) fail((error as { error: string }).error);

      const resolved = await pollTask(org, project, (task as Task).id);
      const identifier = (resolved.result as { requirement?: { identifier: string } })?.requirement
        ?.identifier;

      if (!identifier) fail("unexpected task result: missing requirement identifier");

      const { data: accepted, error: acceptError } =
        await techcorWebApiRequirementsControllerAccept({
          path: { org_slug: org, project_slug: project, identifier },
        });
      if (acceptError) fail((acceptError as { error: string }).error);
      print(accepted);
    });

  cmd
    .command("edit <identifier> [text]")
    .description("Edit a requirement — text, parent, and/or design (at least one required)")
    .option("--project <slug>", "Project slug")
    .option("--context <text>", "Optional context / why")
    .option("--parent <identifier>", "Move to a new parent (use 0.0 for root)")
    .option("--design <text>", "Set the design / how text")
    .action(async (identifier, text, options) => {
      const org = await resolveOrgSlug();
      const project = resolveProject(options.project);

      if (!text && !options.parent && !options.design && !options.context) {
        fail("at least one of text, --parent, --design, or --context is required");
      }

      // Apply requirement text / parent / context change
      if (text || options.parent || (options.context && !options.design)) {
        const body: Record<string, string | undefined> = {};
        if (text) body.text = text;
        if (options.context) body.context = options.context;
        if (options.parent) body.parent_identifier = options.parent;

        const { data: task, error } = await techcorWebApiRequirementsControllerUpdate({
          path: { org_slug: org, project_slug: project, identifier },
          body,
        });
        if (error) fail((error as { error: string }).error);

        if ((task as Task).id) {
          const resolved = await pollTask(org, project, (task as Task).id);

          if (resolved.status === "awaiting_review") {
            const impacted = (resolved.result as { impacted?: unknown[] })?.impacted ?? [];
            if (impacted.length === 0) {
              const { data: accepted, error: acceptError } =
                await techcorWebApiRequirementsControllerAccept({
                  path: { org_slug: org, project_slug: project, identifier },
                });
              if (acceptError) fail((acceptError as { error: string }).error);
            } else {
              if (!options.design) {
                print(resolved);
                return;
              }
            }
          }
        }
      }

      // Apply design change
      if (options.design) {
        const { data: designTask, error: designError } = await techcorWebApiDesignControllerUpdate({
          path: { org_slug: org, project_slug: project, identifier },
          body: { text: options.design },
        });
        if (designError) fail((designError as { error: string }).error);

        const designTaskData = designTask as unknown as Task;
        if (designTaskData?.id) {
          await pollTask(org, project, designTaskData.id);
        }
      }

      const { data: req, error: reqError } = await techcorWebApiRequirementsControllerShow({
        path: { org_slug: org, project_slug: project, identifier },
      });
      if (reqError) fail((reqError as { error: string }).error);
      print(req);
    });

  cmd
    .command("accept <identifier>")
    .description("Accept a requirement")
    .option("--project <slug>", "Project slug")
    .action(async (identifier, options) => {
      const org = await resolveOrgSlug();
      const project = resolveProject(options.project);
      const { data, error } = await techcorWebApiRequirementsControllerAccept({
        path: { org_slug: org, project_slug: project, identifier },
      });
      if (error) fail((error as { error: string }).error);
      print(data as Requirement);
    });

  return cmd;
}
