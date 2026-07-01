# Technically Correct CLI

`tc` is the command-line interface for [Technically Correct](https://technicallycorrect.io) — a requirements-driven development platform.

## Installation

```bash
npm install -g @technicallycorrect/cli
```

## Configuration

```bash
tc config --host localhost --port 4000 --api-key <your-api-key>
tc config  # view current configuration
```

Configuration is stored at `~/.technicallycorrect/settings.json`. The organization is resolved automatically from your API key on first use.

## Project setup

Run `tc init` in your repository to inject usage instructions into your AI assistant's config files and set the default project for that directory:

```bash
tc init <slug>   # updates AGENTS.md, CLAUDE.md, .cursor/rules/, .windsurf/rules/
                 # and writes .technicallycorrect/settings.json with the project slug
tc init -g       # updates global AI config files (~/.claude/CLAUDE.md, etc.)
```

Once initialised, `--project` is optional on all commands — it is resolved from the local `.technicallycorrect/settings.json` (or global settings) automatically.

## Commands

### Requirements

```bash
tc r list --project <slug>                         # list all requirements
tc r list --project <slug> --tree                  # nested tree view
tc r list --project <slug> --tree --root 2.0       # subtree rooted at 2.0
tc r <identifier> --project <slug>                 # show a requirement
tc r <identifier> --project <slug> --include-children  # inline child requirements
tc r create <text> --project <slug>                # create a requirement (async, auto-accepts)
tc r edit <identifier> --project <slug>            # edit a requirement — at least one of:
  --parent <identifier>                            #   move to a new parent (0.0 = root)
  --design <text>                                  #   set the design text
  [text]                                           #   update the requirement text (async, shows impact analysis)
  --context <text>                                 #   update the context / why
tc r accept <identifier> --project <slug>          # accept after reviewing impacts
```

### Implementations

```bash
tc i add <identifier> --repo <repo> --commit <hash> --message <msg> --project <slug>
tc i add <identifier> --repo <repo> --commit <hash> --message <msg> --description <text> --project <slug>
```

Links a git commit to a requirement. `--repo`, `--commit`, and `--message` are required. `--description` is optional but recommended — use it to explain what aspect of the requirement the commit addresses.

### Tasks

```bash
tc t list --project <slug>          # list active tasks
tc t <id> --project <slug>          # show a task's status and result
tc t verify <id> --project <slug>   # verify a task awaiting review
```

### Projects

```bash
tc p list    # list all projects in your organization
```

## Async operations

`tc r create` and `tc r edit` (when text is provided) are asynchronous — the CLI polls until the operation completes and returns the final result. If the AI detects impact on related requirements, the result is returned for review without auto-accepting.

## Output format

All commands write JSON to stdout. When stdout is a terminal the output is pretty-printed; when captured by a script or LLM it is compact JSON on a single line. Errors are written to stderr as `{"error": "..."}` and exit non-zero.

## Stale AI config warning

When the CLI is updated, injected content in `AGENTS.md`, `CLAUDE.md`, and other AI config files may be outdated. On each invocation, `tc` checks for stale content and prints a warning to stderr if a refresh is needed:

```
warning: tc init content in CLAUDE.md is outdated (v2.0.0 → v2.1.0). Run `tc init` to refresh.
```
