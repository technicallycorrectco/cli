import { Command } from "commander";
import {
  techcorWebApiImplementationsControllerCreate,
  techcorWebApiRequirementsControllerShow,
} from "../client/sdk.gen.js";
import { resolveOrgSlug } from "../api/index.js";
import { resolveProject } from "../config/index.js";
import { print, fail } from "../output.js";

export function implementationsCommand(): Command {
  const cmd = new Command("i").description("Manage implementations");

  cmd
    .command("add <identifier>")
    .description("Link a git commit to a requirement")
    .option("--project <slug>", "Project slug")
    .option("--repo <repo>", "Repository (e.g. org/repo)")
    .option("--commit <hash>", "Short commit hash")
    .option("--message <msg>", "Commit message")
    .option("--description <text>", "Description of what this commit addresses")
    .action(async (identifier, options) => {
      const org = await resolveOrgSlug();
      const project = resolveProject(options.project);

      if (!options.repo) fail("--repo is required");
      if (!options.commit) fail("--commit is required");
      if (!options.message) fail("--message is required");

      const body = {
        repo: options.repo,
        commit_hash: options.commit,
        commit_message: options.message,
        description: options.description,
      };

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
