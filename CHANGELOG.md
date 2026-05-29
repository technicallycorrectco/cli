# Changelog

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
