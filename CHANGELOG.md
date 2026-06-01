# Changelog

## [2.3.0]

- Updated workflow instructions: single-node pipeline rewrites are accepted silently; only splits (requirements[] > 1 entry) are flagged to the user
- Clarified that `result.change` describes what the pipeline did; `requirements[]` is the authoritative list of all requirements produced — use it for status and acceptance, not `result.requirement`
- Simplified impact/verify decision rule: check `result.impacted` — if non-empty, verify first; otherwise accept all `updated` entries in `requirements[]` directly

## [2.2.1]

- Fixed missing build step before publish — dist was not rebuilt in 2.2.0

## [2.2.0]

- `tc r create` and `tc r edit` no longer auto-accept requirements. Both commands now return the full task result (requirements, text change, impacts) so the calling LLM can review and accept explicitly via `tc r accept <identifier>`
- Updated `tc init` workflow instructions to guide the LLM through handling the task result: checking for rewritten text, accepting all `updated` requirements, and surfacing impacts to the user
- `tc r edit --context` now works as a standalone flag without requiring `--text` or `--parent`

## [2.1.5]

- Fixed `tc r edit --context` flag not applying when used without `--text` or `--parent`

## [2.1.4]

- `tc r list --tree` now excludes rejected requirements from the tree output

## [2.1.3]

- Fixed `tc init` duplicating injected content when updating files that used the old-format delimiter

## [2.1.2]

- Updated README to reflect v2.x changes (named flags, local settings, tree view, staleness warning)

## [2.1.1]

- Help is now available for all subcommands (`tc r --help`, `tc t --help`, etc.) without requiring `tc config`

## [2.1.0]

- `tc init` now embeds a version stamp (`<!-- Technically Correct CLI: vX.Y.Z -->`) in injected content
- On each `tc` invocation, a warning is printed to stderr if any AI config files contain outdated injected content, prompting `tc init` to refresh

## [2.0.0]

**Breaking changes:**

- Config moved from `~/.technicallycorrect/cli/config.json` to `~/.technicallycorrect/settings.json` (under a `cli` key)
- `tc i add <identifier> <json>` replaced with named flags: `tc i add <identifier> --repo <repo> --commit <hash> --message <msg> --description <text>`
- `tc r edit <identifier> <text>` — text argument is now optional; use `--parent` and/or `--design` flags
- `tc d set` removed — design editing is now part of `tc r edit --design <text>`

**New features:**

- Local `.technicallycorrect/settings.json` for per-repo project default; `tc init <slug>` writes it automatically
- `--project` resolves from local or global settings — no longer required on every command when configured
- `tc r list --tree` outputs a nested JSON tree; `--root <identifier>` filters to a subtree
- `tc r show --include-children` inlines one level of child requirements into the response
- All list commands (`tc r list`, `tc t list`, `tc p list`) return `{"data": []}` when empty

## [1.2.7]

- `tc init` now accepts the project slug as a positional argument (`tc init <slug>`) in addition to `--project`
- `tc init` with no project slug lists available projects instead of erroring
- `tc init` injected commands now include `--project` flags

## [1.2.6]

- `tc config` no longer prints the config after setting values

## [1.2.5]

- Reordered commands in help output: `config`, `init`, then single-letter commands

## [1.2.4]

- Version flag is now lowercase `-v` (was `-V`)
- Help and version flags no longer require a valid config

## [1.2.3]

- Error messages are now lowercase with no trailing periods

## [1.2.2]

- Org slug is now auto-resolved from the API key on `tc config --api-key` — no need to set it manually
- Version is now read from `package.json` instead of being hardcoded

## [1.2.1]

- Fixed a first-run error when no config file exists yet

## [1.2.0]

- Fixed a directory import error when `tc` is installed globally

## [1.1.0]

- Rewrote `tc init` injected content with detailed workflow instructions for LLMs
- Fixed output for `tc r edit` and `tc i add`
- Replaced GitHub Actions publish workflow with `npm run release:*` scripts

## [1.0.0]

Initial release. Includes all core commands:

- `tc config` — configure host, port, and API key; auto-resolve org slug
- `tc init` — inject CLI usage instructions into AI assistant config files (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, `.windsurf/rules/`); `-g` for global config files
- `tc r` — list, show, create, edit, and accept requirements
- `tc t` — list, show, and verify tasks
- `tc i add` — link a git commit to a requirement
- `tc d set` — set the design for a requirement
- `tc p list` — list projects in your organization
