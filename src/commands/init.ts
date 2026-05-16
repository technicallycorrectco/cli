import { Command } from "commander";
import fs from "fs";
import path from "path";
import os from "os";
import { fail } from "../output.js";

const DELIMITER_START = "<!-- Technically Correct CLI -->";
const DELIMITER_END = "<!-- Technically Correct CLI -->";

const CONTENT = `${DELIMITER_START}
## Technically Correct CLI (\`tc\`)

Run \`tc --help\` for full documentation. Run \`tc <command> --help\` for command-specific help.

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
${DELIMITER_END}`;

function injectContent(filePath: string): void {
  const existing = fs.readFileSync(filePath, "utf-8");
  const startIdx = existing.indexOf(DELIMITER_START);
  const endIdx = existing.indexOf(DELIMITER_END, startIdx + DELIMITER_START.length);

  let updated: string;
  if (startIdx !== -1 && endIdx !== -1) {
    updated = existing.slice(0, startIdx) + CONTENT + existing.slice(endIdx + DELIMITER_END.length);
  } else {
    updated = existing.trimEnd() + "\n\n" + CONTENT + "\n";
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
    .action((options) => {
      const files = options.global ? collectGlobalFiles() : collectFiles(process.cwd());

      if (files.length === 0) {
        fail(
          options.global
            ? "No global AI configuration files found"
            : "No AI configuration files found in current directory"
        );
      }

      for (const file of files) {
        injectContent(file);
      }
    });
}
