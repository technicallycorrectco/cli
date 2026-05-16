# Requirements Status

| Req       | Description                                                                 | Status | Commit |
|-----------|-----------------------------------------------------------------------------|--------|--------|
| **1.0**   | **Configuration**                                                           |        |        |
| 1.1       | Set API base URL                                                            | Done   | ef8bee0 |
| 1.2       | Set API port                                                                | Done   | ef8bee0 |
| 1.3       | Set bearer token for API authentication                                     | Done   | ef8bee0 |
| 1.4       | Store configuration in ~/.technicallycorrect/cli/config.json                | Done   | ef8bee0 |
| 1.5       | Resolve org slug from API on first use and cache in config                  | -      | -      |
| 1.6       | View current resolved configuration                                         | Done   | ef8bee0 |
| 1.7       | `tc config` with no args displays current resolved configuration            | Done   | ef8bee0 |
| 1.8       | `tc config` accepts --host, --port, --api-key flags                         | -      | -      |
| **2.0**   | **Requirements**                                                            |        |        |
| 2.1       | `tc r list` lists all requirements for a project                            | Done   | ef8bee0 |
| 2.2       | `tc r <identifier>` shows a single requirement                              | Done   | ef8bee0 |
| 2.3       | `tc r create <text>` creates a requirement                                  | Done   | ef8bee0 |
| 2.3.1     | Accept optional --parent flag on create                                     | Done   | ef8bee0 |
| 2.3.2     | Accept optional --context flag on create                                    | Done   | ef8bee0 |
| 2.3.3     | Poll task until awaiting_review or complete after create                    | Done   | ef8bee0 |
| 2.3.3.1   | Auto-accept and display accepted requirement when awaiting_review           | Done   | ef8bee0 |
| 2.4       | `tc r edit <identifier> <text>` edits a requirement                         | Done   | ef8bee0 |
| 2.4.1     | Poll task until awaiting_review or complete after edit                      | Done   | ef8bee0 |
| 2.4.1.1   | Auto-accept and display accepted requirement when awaiting_review with no impacts | Done   | ef8bee0 |
| 2.4.1.2   | Display task result with affected requirements when awaiting_review with impacts | Done   | ef8bee0 |
| 2.5       | `tc r accept <identifier>` accepts a requirement                            | Done   | ef8bee0 |
| **3.0**   | **Tasks**                                                                   |        |        |
| 3.1       | `tc t <id>` shows a single task                                             | Done   | ef8bee0 |
| 3.2       | `tc t list` lists active tasks for a project                                | Done   | ef8bee0 |
| 3.3       | `tc t verify <id>` verifies a task                                          | Done   | ef8bee0 |
| **4.0**   | **Implementations**                                                         |        |        |
| 4.1       | `tc i add <identifier> <json>` links a git commit to a requirement          | Done   | ef8bee0 |
| 4.1.1     | JSON argument specifies repo, commit_hash, and commit_message               | Done   | ef8bee0 |
| 4.1.2     | description field in JSON argument is optional                              | Done   | ef8bee0 |
| 4.2       | Display updated requirement after implementation is created                 | Done   | ef8bee0 |
| **5.0**   | **Designs**                                                                 |        |        |
| 5.1       | `tc d set <identifier> <text>` sets the design text for a requirement       | Done   | ef8bee0 |
| 5.2       | Poll task until awaiting_review or complete after design set                | Done   | ef8bee0 |
| 5.2.1     | Auto-accept and display updated requirement when awaiting_review with no impacts | Done   | ef8bee0 |
| 5.2.2     | Display task result with affected implementations when awaiting_review with impacts | Done   | ef8bee0 |
| **6.0**   | **Projects**                                                                |        |        |
| 6.1       | `tc p list` lists all projects for an organization                          | Done   | ef8bee0 |
| **7.0**   | **Init**                                                                    |        |        |
| 7.1       | `tc init --project <slug>` injects usage instructions into AI config files  | -      | -      |
| 7.2       | Search and update AGENTS.md, CLAUDE.md, .cursor/rules/, .windsurf/rules/   | Done   | ef8bee0 |
| 7.3       | Display error and exit if no supported files exist                          | Done   | ef8bee0 |
| 7.4       | Delimit injected content with <!-- Technically Correct CLI --> tags         | Done   | ef8bee0 |
| 7.5       | Injected content includes project slug and command usage guide              | -      | -      |
| 7.6       | -g flag updates global AI config files instead of project-level files      | Done   | ef8bee0 |
| 7.6.1     | Global files in platform home dir: .claude/CLAUDE.md, .cursor/rules/, .windsurf/rules/ | Done   | ef8bee0 |
| 7.6.2     | Display error and exit if -g is set and no global files exist               | Done   | ef8bee0 |
| 7.6.3     | --project flag not required when -g is set                                  | -      | -      |
| **8.0**   | **CLI Interface**                                                           |        |        |
| 8.1       | All project commands accept --project flag to override for that invocation  | Done   | ef8bee0 |
| 8.2       | Output all responses as JSON                                                | Done   | ef8bee0 |
| 8.3       | Display error identifying missing required value                            | Done   | ef8bee0 |
| 8.4       | Display API error and exit non-zero on API failure                          | Done   | ef8bee0 |
