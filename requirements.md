# Technically Correct CLI v1.0

## 1.0 The CLI shall allow a user to configure the connection to a Technically Correct instance.

- **1.1** The CLI shall allow a user to set an API base URL.
- **1.2** The CLI shall allow a user to set an API port.
- **1.3** The CLI shall allow a user to set a bearer token for API authentication.
- **1.4** The CLI shall store global configuration in `~/.technicallycorrect/settings.json` under a `cli` key.
- **1.5** The CLI shall resolve the organization slug from the API on first use and cache it in the configuration file.
- **1.6** The CLI shall allow a user to view the current resolved configuration.
- **1.7** The `tc config` command with no arguments shall display the current resolved configuration (req. 1.6).
- **1.8** The `tc config` command shall accept `--host`, `--port`, and `--api-key` flags to set configuration values.
- **1.9** The CLI shall resolve the current working directory upward to find a `.technicallycorrect/settings.json` file and use its `cli.project` value as the default project slug.
  - **1.9.1** The resolution order for `--project` shall be: explicit flag, local settings file, global settings file, error.
- **1.10** The `tc init <project-slug>` command shall write a `.technicallycorrect/settings.json` file in the current directory with the given project slug.

## 2.0 The CLI shall allow a user to manage requirements.

- **2.1** The `tc r list` command shall list all requirements for a project.
  - **2.1.1** When `--tree` is passed, the CLI shall restructure the flat list into a nested JSON tree using identifier depth.
  - **2.1.2** When `--root <identifier>` is passed with `--tree`, the CLI shall filter the tree to the subtree rooted at that identifier.
  - **2.1.3** When `--tree` is passed, the CLI shall exclude requirements with status `rejected` from the tree output.
- **2.2** The `tc r <identifier>` command shall show a single requirement by identifier.
  - **2.2.1** When `--include-children` is passed, the CLI shall resolve each child URL in parallel and inline the child objects under a `children` key.
- **2.3** The `tc r create <text>` command shall create a requirement for a project.
  - **2.3.1** The CLI shall accept an optional `--parent` flag specifying a parent identifier when creating a requirement.
  - **2.3.2** The CLI shall accept an optional `--context` flag when creating a requirement.
  - **2.3.3** When a requirement is created, the CLI shall poll the task until it reaches `awaiting_review` or `complete` status.
    - **2.3.3.1** When the task reaches `awaiting_review` or `complete`, the CLI shall display the full task result including the `requirements` array, any text change, and any impact findings.
- **2.4** The `tc r edit <identifier>` command shall edit a requirement by identifier.
  - **2.4.1** The `tc r edit` command shall accept an optional text argument, an optional `--parent <identifier>` flag, and an optional `--design <text>` flag.
  - **2.4.2** At least one of the text argument, `--parent`, `--design`, or `--context` flags must be provided.
  - **2.4.3** The `--parent` flag shall move the requirement to the specified parent. The value `0.0` shall move the requirement to root.
  - **2.4.4** The `--design` flag shall set the design text for the requirement in the same invocation.
  - **2.4.5** The CLI shall accept an optional `--context` flag to set the requirement context.
  - **2.4.6** When a requirement text edit is submitted, the CLI shall poll the task until it reaches `awaiting_review` or `complete` status.
    - **2.4.6.1** When the task reaches `awaiting_review`, the CLI shall display the full task result and stop. The caller is responsible for accepting requirements and verifying impacts.
    - **2.4.6.2** When the task reaches `complete`, the CLI shall proceed to apply any `--design` flag and then display the final requirement.
- **2.5** The `tc r accept <identifier>` command shall accept a requirement by identifier.

## 3.0 The CLI shall allow a user to manage tasks.

- **3.1** The `tc t <id>` command shall show a single task by ID.
  - **3.1.1** The `--project` flag shall be optional when a default project is configured via local or global settings.
- **3.2** The `tc t list` command shall list active tasks for a project.
- **3.3** The `tc t verify <id>` command shall verify a task by ID.

## 4.0 The CLI shall allow a user to record implementation nodes.

- **4.1** The `tc i add <identifier>` command shall link a git commit to a requirement.
  - **4.1.1** The `tc i add` command shall accept `--repo`, `--commit`, and `--message` flags. All three are required.
  - **4.1.2** The `tc i add` command shall accept an optional `--description` flag.
- **4.2** When an implementation is created, the CLI shall display the updated requirement.

## 5.0 The CLI shall allow a user to manage projects.

- **5.1** The `tc p list` command shall list all projects for an organization.

## 6.0 The CLI shall provide an init command to inject usage instructions into AI configuration files.

- **6.1** The `tc init <project-slug>` command shall inject Technically Correct CLI usage instructions into AI configuration files in the current directory.
- **6.2** The CLI shall search for and update all of the following files if they exist: `AGENTS.md`, `CLAUDE.md`, and markdown files in `.cursor/rules/` and `.windsurf/rules/`.
- **6.3** If none of the supported files exist, the CLI shall display an error message and exit without creating any files.
- **6.4** The injected content shall be delimited by `<!-- Technically Correct CLI -->` comment tags so that subsequent runs of `tc init` update the content in place rather than appending.
- **6.5** The injected content shall include the project slug and describe when to use each CLI command and how to access help.
- **6.6** When the `-g` flag is set, the `tc init` command shall update global AI configuration files instead of project-level files.
  - **6.6.1** The global configuration files shall be: `<home>/.claude/CLAUDE.md`, `<home>/.cursor/rules/`, and `<home>/.windsurf/rules/`, where `<home>` is the platform home directory.
  - **6.6.2** When the `-g` flag is set and none of the global files exist, the CLI shall display an error message and exit without creating any files.
  - **6.6.3** When the `-g` flag is set, the `--project` flag shall not be required.

## 7.0 The CLI shall provide a consistent command-line interface.

- **7.1** All commands that operate on a project shall accept a `--project <slug>` flag to override the project for that invocation.
- **7.2** The CLI shall output all responses as JSON.
- **7.3** If a required value is missing, then the CLI shall display an error message that identifies the missing value.
- **7.4** If the API returns an error, then the CLI shall display the error message and exit with a non-zero status code.
- **7.5** All list commands shall return `{"data": []}` when there are no results.
