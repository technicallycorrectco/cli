import { Command } from "commander";
import { techcorWebApiProjectsControllerIndex } from "../client/sdk.gen.js";
import { print, fail } from "../output.js";

export function projectsCommand(): Command {
  const cmd = new Command("p").description("Manage projects");

  cmd
    .command("list")
    .description("List all projects")
    .option("--org <slug>", "Organization slug")
    .action(async (options) => {
      const org = options.org ?? fail("--org is required");
      const { data, error } = await techcorWebApiProjectsControllerIndex({
        path: { org_slug: org },
      });
      if (error) fail((error as { error: string }).error);
      print(data);
    });

  return cmd;
}
