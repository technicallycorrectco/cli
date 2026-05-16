import { Command } from "commander";
import {
  techcorWebApiDesignControllerUpdate,
  techcorWebApiRequirementsControllerShow,
} from "../client/sdk.gen.js";
import { resolveOrgSlug } from "../api/index.js";
import { pollTask } from "../services/poller.js";
import { print, fail } from "../output.js";
import type { Task } from "../client/types.gen.js";

export function designsCommand(): Command {
  const cmd = new Command("d").description("Manage designs");

  cmd
    .command("set <identifier> <text>")
    .description("Set the design text for a requirement")
    .option("--project <slug>", "Project slug")
    .action(async (identifier, text, options) => {
      const org = await resolveOrgSlug();
      const project = options.project ?? fail("--project is required");

      const { data: task, error } = await techcorWebApiDesignControllerUpdate({
        path: { org_slug: org, project_slug: project, identifier },
        body: { text },
      });
      if (error) fail((error as { error: string }).error);

      const taskData = task as unknown as Task;
      if (taskData?.id) {
        const resolved = await pollTask(org, project, taskData.id);

        if (resolved.status === "awaiting_review") {
          const impacts = (resolved.result as { impacts?: unknown[] })?.impacts ?? [];
          if (impacts.length === 0) {
            const { data: req, error: reqError } = await techcorWebApiRequirementsControllerShow({
              path: { org_slug: org, project_slug: project, identifier },
            });
            if (reqError) fail((reqError as { error: string }).error);
            print(req);
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
      } else {
        const { data: req, error: reqError } = await techcorWebApiRequirementsControllerShow({
          path: { org_slug: org, project_slug: project, identifier },
        });
        if (reqError) fail((reqError as { error: string }).error);
        print(req);
      }
    });

  return cmd;
}
