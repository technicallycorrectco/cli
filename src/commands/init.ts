import { Command } from "commander";
import fs from "fs";
import path from "path";
import os from "os";
import { fail } from "../output.js";

const DELIMITER = "<!-- Technically Correct CLI -->";

function buildContent(projectSlug?: string): string {
  const projectLine = projectSlug
    ? `**Project:** \`${projectSlug}\` — pass \`--project ${projectSlug}\` on all commands.\n\n`
    : "";

  return `${DELIMITER}
## Technically Correct CLI (\`tc\`)

${projectLine}Run \`tc --help\` for full documentation. Run \`tc <command> --help\` for command-specific help.

### When to use each command

- \`tc r create <text>\` — Create a new requirement before starting work on a feature
- \`tc r list\` — List all requirements for the current project
- \`tc r <identifier>\` — Show a requirement with its design and implementations
- \`tc r edit <identifier> <text>\` — Update a requirement; reviews impact on related requirements
- \`tc r accept <identifier>\` — Accept a requirement after reviewing impact analysis
- \`tc d set <identifier> <text>\` — Record a design or implementation plan for a requirement
- \`tc i add <identifier> <json>\` — Link a git commit to a requirement after committing
- \`tc t list\` — List active tasks (pending AI pipeline operations)
- \`tc t <id>\` — Show a task's status and result
- \`tc t verify <id>\` — Verify a task that is awaiting review
- \`tc p list\` — List all projects in the organization
- \`tc config\` — View current CLI configuration
${DELIMITER}`;
}

function injectContent(filePath: string, projectSlug?: string): void {
  const existing = fs.readFileSync(filePath, "utf-8");
  const content = buildContent(projectSlug);
  const startIdx = existing.indexOf(DELIMITER);
  const endIdx =
    startIdx !== -1
      ? existing.indexOf(DELIMITER, startIdx + DELIMITER.length) + DELIMITER.length
      : -1;

  let updated: string;
  if (startIdx !== -1 && endIdx > startIdx) {
    updated = existing.slice(0, startIdx) + content + existing.slice(endIdx);
  } else {
    updated = existing.trimEnd() + "\n\n" + content + "\n";
  }

  fs.writeFileSync(filePath, updated);
  console.error(`Updated ${filePath}`);
}

function findMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f: string) => f.endsWith(".md"))
    .map((f: string) => path.join(dir, f));
}

function collectFiles(baseDir: string): string[] {
  const candidates = [
    path.join(baseDir, "AGENTS.md"),
    path.join(baseDir, "CLAUDE.md"),
    ...findMarkdownFiles(path.join(baseDir, ".cursor", "rules")),
    ...findMarkdownFiles(path.join(baseDir, ".windsurf", "rules")),
  ];
  return candidates.filter((f) => fs.existsSync(f));
}

function collectGlobalFiles(): string[] {
  const home = os.homedir();
  const candidates = [
    path.join(home, ".claude", "CLAUDE.md"),
    ...findMarkdownFiles(path.join(home, ".cursor", "rules")),
    ...findMarkdownFiles(path.join(home, ".windsurf", "rules")),
  ];
  return candidates.filter((f) => fs.existsSync(f));
}

export function initCommand(): Command {
  return new Command("init")
    .description("Inject CLI usage instructions into AI configuration files")
    .option("-g, --global", "Update global AI configuration files")
    .option("--project <slug>", "Project slug to include in injected content")
    .action((options) => {
      const isGlobal = options.global ?? false;

      if (!isGlobal && !options.project) {
        fail("--project <slug> is required");
      }

      const files = isGlobal ? collectGlobalFiles() : collectFiles(process.cwd());

      if (files.length === 0) {
        fail(
          isGlobal
            ? "No global AI configuration files found"
            : "No AI configuration files found in current directory"
        );
      }

      for (const file of files) {
        injectContent(file, isGlobal ? undefined : options.project);
      }
    });
}
