import { Command } from "commander";
import { techcorWebApiImplementationsControllerCreate } from "../client/sdk.gen.js";
import type { Config } from "../config/index.js";
import { print, fail } from "../output.js";
import type { ImplementationCreate } from "../client/types.gen.js";

export function implementationsCommand(config: Config): Command {
  const cmd = new Command("i").description("Manage implementations");

  cmd
    .command("add <identifier> <json>")
    .description("Link a git commit to a requirement")
    .option("--org <slug>", "Organization slug")
    .option("--project <slug>", "Project slug")
    .action(async (identifier, json, options) => {
      const org = options.org ?? fail("--org is required");
      const project = options.project ?? config.project ?? fail("--project is required");

      let body: ImplementationCreate;
      try {
        body = JSON.parse(json) as ImplementationCreate;
      } catch {
        fail("Invalid JSON argument");
      }

      const { data, error } = await techcorWebApiImplementationsControllerCreate({
        path: { org_slug: org, project_slug: project, identifier },
        body,
      });
      if (error) fail((error as { error: string }).error);
      print(data);
    });

  return cmd;
}
