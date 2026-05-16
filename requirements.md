# Technically Correct CLI v1.0

## 1.0 The CLI shall allow a user to configure the connection to a Technically Correct instance.

- **1.1** The CLI shall allow a user to set an API base URL.
- **1.2** The CLI shall allow a user to set an API port.
- **1.3** The CLI shall allow a user to set a bearer token for API authentication.
- **1.4** The CLI shall store configuration in `~/.technicallycorrect/cli/config.json`.
- **1.5** The CLI shall resolve the organization slug from the API on first use and cache it in the configuration file.
- **1.6** The CLI shall allow a user to view the current resolved configuration.
- **1.7** The `tc config` command with no arguments shall display the current resolved configuration (req. 1.6).
- **1.8** The `tc config` command shall accept `--host`, `--port`, and `--api-key` flags to set configuration values.

## 2.0 The CLI shall allow a user to manage requirements.

- **2.1** The `tc r list` command shall list all requirements for a project.
- **2.2** The `tc r <identifier>` command shall show a single requirement by identifier.
- **2.3** The `tc r create <text>` command shall create a requirement for a project.
  - **2.3.1** The CLI shall accept an optional `--parent` flag specifying a parent identifier when creating a requirement.
  - **2.3.2** The CLI shall accept an optional `--context` flag when creating a requirement.
  - **2.3.3** When a requirement is created, the CLI shall poll the task until it reaches `awaiting_review` or `complete` status.
    - **2.3.3.1** When the task reaches `awaiting_review`, the CLI shall automatically accept the requirement and display the accepted requirement.
- **2.4** The `tc r edit <identifier> <text>` command shall edit a requirement by identifier.
  - **2.4.1** When a requirement edit is submitted, the CLI shall poll the task until it reaches `awaiting_review` or `complete` status.
    - **2.4.1.1** When the task reaches `awaiting_review` and there are no impact analysis findings, the CLI shall automatically accept the requirement and display the accepted requirement.
    - **2.4.1.2** When the task reaches `awaiting_review` and there are impact analysis findings, the CLI shall display the task result including all affected requirements and shall not automatically accept.
- **2.5** The `tc r accept <identifier>` command shall accept a requirement by identifier.

## 3.0 The CLI shall allow a user to manage tasks.

- **3.1** The `tc t <id>` command shall show a single task by ID.
- **3.2** The `tc t list` command shall list active tasks for a project.
- **3.3** The `tc t verify <id>` command shall verify a task by ID.

## 4.0 The CLI shall allow a user to record implementation nodes.

- **4.1** The `tc i add <identifier> <json>` command shall link a git commit to a requirement.
  - **4.1.1** The JSON argument shall specify the `repo`, `commit_hash`, and `commit_message` fields.
  - **4.1.2** The `description` field in the JSON argument shall be optional.
- **4.2** When an implementation is created, the CLI shall display the updated requirement.

## 5.0 The CLI shall allow a user to manage designs.

- **5.1** The `tc d set <identifier> <text>` command shall set the design text for a requirement by identifier.
- **5.2** When a design is set, the CLI shall poll the task until it reaches `awaiting_review` or `complete` status.
  - **5.2.1** When the task reaches `awaiting_review` and there are no impact analysis findings, the CLI shall automatically accept the design and display the updated requirement.
  - **5.2.2** When the task reaches `awaiting_review` and there are impact analysis findings, the CLI shall display the task result including all affected implementations and shall not automatically accept.

## 6.0 The CLI shall allow a user to manage projects.

- **6.1** The `tc p list` command shall list all projects for an organization.

## 7.0 The CLI shall provide an init command to inject usage instructions into AI configuration files.

- **7.1** The `tc init --project <slug>` command shall inject Technically Correct CLI usage instructions into AI configuration files in the current directory.
- **7.2** The CLI shall search for and update all of the following files if they exist: `AGENTS.md`, `CLAUDE.md`, and markdown files in `.cursor/rules/` and `.windsurf/rules/`.
- **7.3** If none of the supported files exist, the CLI shall display an error message and exit without creating any files.
- **7.4** The injected content shall be delimited by `<!-- Technically Correct CLI -->` comment tags so that subsequent runs of `tc init` update the content in place rather than appending.
- **7.5** The injected content shall include the project slug and describe when to use each CLI command and how to access help.
- **7.6** When the `-g` flag is set, the `tc init` command shall update global AI configuration files instead of project-level files.
  - **7.6.1** The global configuration files shall be: `<home>/.claude/CLAUDE.md`, `<home>/.cursor/rules/`, and `<home>/.windsurf/rules/`, where `<home>` is the platform home directory.
  - **7.6.2** When the `-g` flag is set and none of the global files exist, the CLI shall display an error message and exit without creating any files.
  - **7.6.3** When the `-g` flag is set, the `--project` flag shall not be required.

## 8.0 The CLI shall provide a consistent command-line interface.

- **8.1** All commands that operate on a project shall accept a `--project <slug>` flag to override the project for that invocation.
- **8.2** The CLI shall output all responses as JSON.
- **8.3** If a required value is missing, then the CLI shall display an error message that identifies the missing value.
- **8.4** If the API returns an error, then the CLI shall display the error message and exit with a non-zero status code.
