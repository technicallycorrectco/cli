import { Command } from "commander";
import fs from "fs";
import path from "path";
import os from "os";
import { techcorWebApiProjectsControllerIndex } from "../client/sdk.gen.js";
import { resolveOrgSlug } from "../api/index.js";
import { saveLocalConfig } from "../config/index.js";
import { fail } from "../output.js";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version } = require("../../package.json") as { version: string };

const DELIMITER_PREFIX = "<!-- Technically Correct CLI";
const CLOSE_DELIMITER = "<!-- /Technically Correct CLI -->";

function openDelimiter(): string {
  return `${DELIMITER_PREFIX}: v${version} -->`;
}

function buildContent(projectSlug?: string): string {
  const slug = projectSlug ?? "<project-slug>";
  const projectLine = projectSlug
    ? `**Project:** \`${slug}\` — pass \`--project ${slug}\` on all commands.\n\n`
    : "";

  return `${openDelimiter()}
## Technically Correct CLI (\`tc\`)

${projectLine}
### Workflow

Every feature or change follows this sequence: **requirement → design → implement → link commits**. Do not skip steps or reorder them.

**1. At the start of every session — read the requirements**

Run \`tc r list --project ${slug}\` before doing anything else. Requirements may have been renumbered or updated since the last session. This is your source of truth — do not rely on memory.

**2. Before any planning or coding — create a requirement**

Run \`tc r create <text> --project ${slug}\` as soon as the user describes a feature, change, or bug fix. The requirement captures *what* must be true, not *how* to build it. Write it in EARS format using modal verbs: "When X, the system shall Y." Create sub-requirements with \`--parent <identifier>\` when a requirement has distinct parts. Run \`tc r list --project ${slug}\` after creating to confirm identifiers and see the updated requirement tree.

**3. Before writing any code — set a design**

Run \`tc r edit <identifier> --design <text> --project ${slug}\` after agreeing on an approach with the user but before implementing. The design captures *how* you will satisfy the requirement — architecture decisions, data structures, key functions, edge cases. If the command returns an \`impacted\` list, show it to the user and ask for confirmation before proceeding.

**4. After each commit — link the implementation**

Run \`tc i add <identifier> --repo <repo> --commit <hash> --message <msg> --description <text> --project ${slug}\` immediately after every \`git commit\` that implements part of a requirement. Do this before moving on. Always include \`--description\` explaining what aspect of the requirement this commit addresses — do not rely on the commit message alone as it may be too sparse. \`--repo\`, \`--commit\`, and \`--message\` are required.

Example: \`tc i add 1.0 --repo org/repo --commit abc1234 --message "feat: add handler" --description "Implements the request validation logic from the design" --project ${slug}\`

**5. When edit returns impacts — review before accepting**

If \`tc r edit\` returns a result with an \`impacted\` list, show it to the user and ask for confirmation before calling \`tc r accept <identifier> --project ${slug}\` or \`tc t verify <id> --project ${slug}\`. Run \`tc r list --project ${slug}\` after accepting to confirm the updated state.

**6. If the user asks you to implement something that conflicts with existing requirements**

You cannot know all conflicts in advance. Trust the impact analysis — if \`tc r edit\` returns impacts, that is the signal to pause. If the user's instruction seems to contradict a requirement you can see in \`tc r list --project ${slug}\`, flag it explicitly and ask whether to update the requirement first.

### Other commands

- \`tc r <identifier> --project ${slug}\` — Show a single requirement with its design and linked commits
- \`tc t list --project ${slug}\` — List active background tasks
- \`tc t verify <id> --project ${slug}\` — Verify a task awaiting review
- \`tc p list\` — List all projects in the organization
- \`tc config\` — View current CLI configuration
${CLOSE_DELIMITER}`;
}

function injectContent(filePath: string, projectSlug?: string): void {
  const existing = fs.readFileSync(filePath, "utf-8");
  const content = buildContent(projectSlug);
  const startIdx = existing.indexOf(DELIMITER_PREFIX);
  const closeIdx = startIdx !== -1 ? existing.indexOf(CLOSE_DELIMITER, startIdx) : -1;
  const endIdx = closeIdx !== -1 ? closeIdx + CLOSE_DELIMITER.length : -1;

  let updated: string;
  if (startIdx !== -1 && endIdx !== -1) {
    updated = existing.slice(0, startIdx) + content + existing.slice(endIdx);
  } else {
    updated = existing.trimEnd() + "\n\n" + content + "\n";
  }

  fs.writeFileSync(filePath, updated);
  console.error(`updated ${filePath}`);
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

function extractInjectedVersion(content: string): string | null {
  const match = content.match(/<!-- Technically Correct CLI: v([\d.]+) -->/);
  return match ? match[1] : null;
}

export function collectAllFiles(): string[] {
  return [...collectFiles(process.cwd()), ...collectGlobalFiles()];
}

export function checkStaleness(files: string[]): void {
  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      if (!content.includes(DELIMITER_PREFIX)) continue;
      const injectedVersion = extractInjectedVersion(content);
      if (!injectedVersion || injectedVersion !== version) {
        const from = injectedVersion ? `v${injectedVersion}` : "an older version";
        console.error(
          `warning: tc init content in ${path.basename(filePath)} is outdated (${from} → v${version}). Run \`tc init\` to refresh.`
        );
      }
    } catch {
      // file unreadable — skip
    }
  }
}

export function initCommand(): Command {
  return new Command("init")
    .description("Inject CLI usage instructions into AI configuration files")
    .argument("[project-slug]", "Project slug to include in injected content")
    .option("-g, --global", "Update global AI configuration files")
    .action(async (projectSlug, options) => {
      const isGlobal = options.global ?? false;

      if (!isGlobal && !projectSlug) {
        const org = await resolveOrgSlug();
        const { data, error } = await techcorWebApiProjectsControllerIndex({
          path: { org_slug: org },
        });
        if (error) fail((error as { error: string }).error);
        const projects = (data as { data: { slug: string; name: string }[] })?.data ?? [];
        if (projects.length === 0) {
          fail("no projects found — create one at technicallycorrect.io");
        }
        console.log(projects.map((p) => p.slug).join("\n"));
        console.error("\nrun `tc init <project-slug>` with one of the above");
        return;
      }

      if (!isGlobal && projectSlug) {
        saveLocalConfig(process.cwd(), { project: projectSlug });
      }

      const files = isGlobal ? collectGlobalFiles() : collectFiles(process.cwd());

      if (files.length === 0) {
        fail(
          isGlobal
            ? "no global AI configuration files found"
            : "no AI configuration files found in current directory"
        );
      }

      for (const file of files) {
        injectContent(file, isGlobal ? undefined : projectSlug);
      }
    });
}
