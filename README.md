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

Configuration is stored at `~/.technicallycorrect/cli/config.json`. The organization is resolved automatically from your API key on first use.

## Commands

### Requirements

```bash
tc r list --project <slug>                        # list all requirements
tc r <identifier> --project <slug>                # show a requirement with design and implementations
tc r create <text> --project <slug>               # create a requirement (async, auto-accepts)
tc r edit <identifier> <text> --project <slug>    # edit a requirement (async, shows impact analysis)
tc r accept <identifier> --project <slug>         # accept a requirement after reviewing impacts
```

### Designs

```bash
tc d set <identifier> <text> --project <slug>     # set the design for a requirement (async)
```

### Implementations

```bash
tc i add <identifier> <json> --project <slug>     # link a git commit to a requirement
```

The JSON argument must include `repo`, `commit_hash`, and `commit_message`. `description` is optional:

```bash
tc i add 1.0 '{"repo":"my-repo","commit_hash":"abc123","commit_message":"fix: update handler"}' --project <slug>
```

### Tasks

```bash
tc t list --project <slug>     # list active tasks
tc t <id> --project <slug>     # show a task's status and result
tc t verify <id> --project <slug>  # verify a task awaiting review
```

### Projects

```bash
tc p list    # list all projects in your organization
```

### Init

Inject CLI usage instructions into your AI assistant's configuration files so it knows how to use `tc` in the current project:

```bash
tc init --project <slug>   # updates AGENTS.md, CLAUDE.md, .cursor/rules/, .windsurf/rules/
tc init -g                 # updates global AI config files (~/.claude/CLAUDE.md, etc.)
```

## Async operations

`tc r create`, `tc r edit`, and `tc d set` are asynchronous — the CLI polls until the operation completes and returns the final result. For edits and designs, if the AI detects impact on related requirements or implementations, the result is returned for review without auto-accepting.
