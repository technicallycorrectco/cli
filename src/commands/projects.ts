import { Command } from "commander";
import { techcorWebApiProjectsControllerIndex } from "../client/sdk.gen.js";
import { resolveOrgSlug } from "../api/index.js";
import { fail, failApiError, printList } from "../output.js";

export function projectsCommand(): Command {
  const cmd = new Command("p").description("Manage projects");

  cmd
    .command("list")
    .description("List all projects")
    .action(async () => {
      const org = await resolveOrgSlug();
      const { data, error } = await techcorWebApiProjectsControllerIndex({
        path: { org_slug: org },
      });
      if (error) failApiError(error);
      printList(data);
    });

  return cmd;
}
