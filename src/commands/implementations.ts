import { Command } from "commander";
import {
  techcorWebApiImplementationsControllerCreate,
  techcorWebApiRequirementsControllerShow,
} from "../client/sdk.gen.js";
import { resolveOrgSlug } from "../api/index.js";
import { print, fail } from "../output.js";
import type { ImplementationCreate } from "../client/types.gen.js";

export function implementationsCommand(): Command {
  const cmd = new Command("i").description("Manage implementations");

  cmd
    .command("add <identifier> <json>")
    .description("Link a git commit to a requirement")
    .option("--project <slug>", "Project slug")
    .action(async (identifier, json, options) => {
      const org = await resolveOrgSlug();
      const project = options.project ?? fail("--project is required");

      let body: ImplementationCreate;
      try {
        body = JSON.parse(json) as ImplementationCreate;
      } catch {
        fail("Invalid JSON argument");
      }

      const { error } = await techcorWebApiImplementationsControllerCreate({
        path: { org_slug: org, project_slug: project, identifier },
        body,
      });
      if (error) fail((error as { error: string }).error);

      const { data: req, error: reqError } = await techcorWebApiRequirementsControllerShow({
        path: { org_slug: org, project_slug: project, identifier },
      });
      if (reqError) fail((reqError as { error: string }).error);
      print(req);
    });

  return cmd;
}
