# Technically Correct CLI v1.0

## 1.0 The CLI shall allow a user to configure the connection to a Technically Correct instance.

- **1.1** The CLI shall allow a user to set an API base URL.
- **1.2** The CLI shall allow a user to set an API port.
- **1.3** The CLI shall allow a user to set a bearer token for API authentication.
- **1.4** The CLI shall store configuration in `~/.technicallycorrect/cli/config.json`.
- **1.5** The CLI shall allow a user to set a default project slug.
- **1.6** The CLI shall allow a user to view the current resolved configuration.
- **1.7** The `tc config` command with no arguments shall display the current resolved configuration (req. 1.6).
- **1.8** The `tc config` command shall accept `--host`, `--port`, `--api-key`, and `--project` flags to set configuration values.

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

## 7.0 The CLI shall provide a consistent command-line interface.

- **7.1** When a project slug is not provided as an argument, the CLI shall read the value from the resolved configuration (req. 1.5).
- **7.2** The CLI shall output all responses as JSON.
- **7.3** If a required configuration value is missing, then the CLI shall display an error message that identifies the missing value.
- **7.4** If the API returns an error, then the CLI shall display the error message and exit with a non-zero status code.
