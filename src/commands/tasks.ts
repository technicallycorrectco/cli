import { Command } from "commander";
import {
  techcorWebApiTasksControllerShow,
  techcorWebApiTasksControllerIndex,
  techcorWebApiTasksControllerVerify,
} from "../client/sdk.gen.js";
import type { Config } from "../config/index.js";
import { print, fail } from "../output.js";

export function tasksCommand(config: Config): Command {
  const cmd = new Command("t").description("Manage tasks");

  cmd
    .command("<id>")
    .description("Show a single task")
    .option("--org <slug>", "Organization slug")
    .option("--project <slug>", "Project slug")
    .action(async (id, options) => {
      const org = options.org ?? fail("--org is required");
      const project = options.project ?? config.project ?? fail("--project is required");
      const { data, error } = await techcorWebApiTasksControllerShow({
        path: { org_slug: org, project_slug: project, id: parseInt(id, 10) },
      });
      if (error) fail((error as { error: string }).error);
      print(data);
    });

  cmd
    .command("list")
    .description("List active tasks")
    .option("--org <slug>", "Organization slug")
    .option("--project <slug>", "Project slug")
    .action(async (options) => {
      const org = options.org ?? fail("--org is required");
      const project = options.project ?? config.project ?? fail("--project is required");
      const { data, error } = await techcorWebApiTasksControllerIndex({
        path: { org_slug: org, project_slug: project },
      });
      if (error) fail((error as { error: string }).error);
      print(data);
    });

  cmd
    .command("verify <id>")
    .description("Verify a task")
    .option("--org <slug>", "Organization slug")
    .option("--project <slug>", "Project slug")
    .action(async (id, options) => {
      const org = options.org ?? fail("--org is required");
      const project = options.project ?? config.project ?? fail("--project is required");
      const { data, error } = await techcorWebApiTasksControllerVerify({
        path: { org_slug: org, project_slug: project, id: parseInt(id, 10) },
      });
      if (error) fail((error as { error: string }).error);
      print(data);
    });

  return cmd;
}
