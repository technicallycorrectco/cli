import { Command } from "commander";
import {
  techcorWebApiRequirementsControllerIndex,
  techcorWebApiRequirementsControllerShow,
  techcorWebApiRequirementsControllerCreate,
  techcorWebApiRequirementsControllerUpdate,
  techcorWebApiRequirementsControllerAccept,
} from "../client/sdk.gen.js";
import { resolveOrgSlug } from "../api/index.js";
import { pollTask } from "../services/poller.js";
import { print, fail } from "../output.js";
import type { Task, Requirement } from "../client/types.gen.js";

export function requirementsCommand(): Command {
  const cmd = new Command("r").description("Manage requirements");

  cmd
    .command("list")
    .description("List all requirements for the project")
    .option("--project <slug>", "Project slug")
    .action(async (options) => {
      const org = await resolveOrgSlug();
      const project = options.project ?? fail("--project is required");
      const { data, error } = await techcorWebApiRequirementsControllerIndex({
        path: { org_slug: org, project_slug: project },
      });
      if (error) fail((error as { error: string }).error);
      print(data);
    });

  const showCmd = new Command("show")
    .argument("<identifier>")
    .description("Show a single requirement")
    .option("--project <slug>", "Project slug")
    .action(async (identifier, options) => {
      const org = await resolveOrgSlug();
      const project = options.project ?? fail("--project is required");
      const { data, error } = await techcorWebApiRequirementsControllerShow({
        path: { org_slug: org, project_slug: project, identifier },
      });
      if (error) fail((error as { error: string }).error);
      print(data);
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
      const project = options.project ?? fail("--project is required");

      const { data: task, error } = await techcorWebApiRequirementsControllerCreate({
        path: { org_slug: org, project_slug: project },
        body: { text, parent_identifier: options.parent, context: options.context },
      });
      if (error) fail((error as { error: string }).error);

      const resolved = await pollTask(org, project, (task as Task).id);
      const identifier = (resolved.result as { requirement?: { identifier: string } })?.requirement
        ?.identifier;

      if (!identifier) fail("Unexpected task result: missing requirement identifier");

      const { data: accepted, error: acceptError } =
        await techcorWebApiRequirementsControllerAccept({
          path: { org_slug: org, project_slug: project, identifier },
        });
      if (acceptError) fail((acceptError as { error: string }).error);
      print(accepted);
    });

  cmd
    .command("edit <identifier> <text>")
    .description("Edit a requirement")
    .option("--project <slug>", "Project slug")
    .option("--context <text>", "Optional context")
    .action(async (identifier, text, options) => {
      const org = await resolveOrgSlug();
      const project = options.project ?? fail("--project is required");

      const { data: task, error } = await techcorWebApiRequirementsControllerUpdate({
        path: { org_slug: org, project_slug: project, identifier },
        body: { text, context: options.context },
      });
      if (error) fail((error as { error: string }).error);

      const resolved = await pollTask(org, project, (task as Task).id);

      if (resolved.status === "awaiting_review") {
        const impacted = (resolved.result as { impacted?: unknown[] })?.impacted ?? [];
        if (impacted.length === 0) {
          const { data: accepted, error: acceptError } =
            await techcorWebApiRequirementsControllerAccept({
              path: { org_slug: org, project_slug: project, identifier },
            });
          if (acceptError) fail((acceptError as { error: string }).error);
          print(accepted);
        } else {
          print(resolved);
        }
      } else {
        const { data: req, error: reqError } = await techcorWebApiRequirementsControllerShow({
          path: { org_slug: org, project_slug: project, identifier },
        });
        if (reqError) fail((reqError as { error: string }).error);
        print(req);
      }
    });

  cmd
    .command("accept <identifier>")
    .description("Accept a requirement")
    .option("--project <slug>", "Project slug")
    .action(async (identifier, options) => {
      const org = await resolveOrgSlug();
      const project = options.project ?? fail("--project is required");
      const { data, error } = await techcorWebApiRequirementsControllerAccept({
        path: { org_slug: org, project_slug: project, identifier },
      });
      if (error) fail((error as { error: string }).error);
      print(data as Requirement);
    });

  return cmd;
}
