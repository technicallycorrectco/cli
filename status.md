# Requirements Status

| Req       | Description                                                                 | Status | Commit |
|-----------|-----------------------------------------------------------------------------|--------|--------|
| **1.0**   | **Configuration**                                                           |        |        |
| 1.1       | Set API base URL                                                            | -      | -      |
| 1.2       | Set API port                                                                | -      | -      |
| 1.3       | Set bearer token for API authentication                                     | -      | -      |
| 1.4       | Store configuration in ~/.technicallycorrect/cli/config.json                | -      | -      |
| 1.5       | Set default project slug                                                    | -      | -      |
| 1.6       | View current resolved configuration                                         | -      | -      |
| 1.7       | `tc config` with no args displays current resolved configuration            | -      | -      |
| 1.8       | `tc config` accepts --host, --port, --api-key, --project flags              | -      | -      |
| **2.0**   | **Requirements**                                                            |        |        |
| 2.1       | `tc r list` lists all requirements for a project                            | -      | -      |
| 2.2       | `tc r <identifier>` shows a single requirement                              | -      | -      |
| 2.3       | `tc r create <text>` creates a requirement                                  | -      | -      |
| 2.3.1     | Accept optional --parent flag on create                                     | -      | -      |
| 2.3.2     | Accept optional --context flag on create                                    | -      | -      |
| 2.3.3     | Poll task until awaiting_review or complete after create                    | -      | -      |
| 2.3.3.1   | Auto-accept and display accepted requirement when awaiting_review           | -      | -      |
| 2.4       | `tc r edit <identifier> <text>` edits a requirement                         | -      | -      |
| 2.4.1     | Poll task until awaiting_review or complete after edit                      | -      | -      |
| 2.4.1.1   | Auto-accept and display accepted requirement when awaiting_review with no impacts | -      | -      |
| 2.4.1.2   | Display task result with affected requirements when awaiting_review with impacts | -      | -      |
| 2.5       | `tc r accept <identifier>` accepts a requirement                            | -      | -      |
| **3.0**   | **Tasks**                                                                   |        |        |
| 3.1       | `tc t <id>` shows a single task                                             | -      | -      |
| 3.2       | `tc t list` lists active tasks for a project                                | -      | -      |
| 3.3       | `tc t verify <id>` verifies a task                                          | -      | -      |
| **4.0**   | **Implementations**                                                         |        |        |
| 4.1       | `tc i add <identifier> <json>` links a git commit to a requirement          | -      | -      |
| 4.1.1     | JSON argument specifies repo, commit_hash, and commit_message               | -      | -      |
| 4.1.2     | description field in JSON argument is optional                              | -      | -      |
| 4.2       | Display updated requirement after implementation is created                 | -      | -      |
| **5.0**   | **Designs**                                                                 |        |        |
| 5.1       | `tc d set <identifier> <text>` sets the design text for a requirement       | -      | -      |
| 5.2       | Poll task until awaiting_review or complete after design set                | -      | -      |
| 5.2.1     | Auto-accept and display updated requirement when awaiting_review with no impacts | -      | -      |
| 5.2.2     | Display task result with affected implementations when awaiting_review with impacts | -      | -      |
| **6.0**   | **Projects**                                                                |        |        |
| 6.1       | `tc p list` lists all projects for an organization                          | -      | -      |
| **7.0**   | **Init**                                                                    |        |        |
| 7.1       | `tc init` injects usage instructions into AI config files in current directory | -      | -      |
| 7.2       | Search and update AGENTS.md, CLAUDE.md, .cursor/rules/, .windsurf/rules/   | -      | -      |
| 7.3       | Display error and exit if no supported files exist                          | -      | -      |
| 7.4       | Delimit injected content with <!-- Technically Correct CLI --> tags         | -      | -      |
| 7.5       | Injected content describes when to use each command and how to access help  | -      | -      |
| 7.6       | -g flag updates global AI config files instead of project-level files      | -      | -      |
| 7.6.1     | Global files in platform home dir: .claude/CLAUDE.md, .cursor/rules/, .windsurf/rules/ | -      | -      |
| 7.6.2     | Display error and exit if -g is set and no global files exist               | -      | -      |
| **8.0**   | **CLI Interface**                                                           |        |        |
| 8.1       | Read project slug from configuration when not provided as argument          | -      | -      |
| 8.2       | Output all responses as JSON                                                | -      | -      |
| 8.3       | Display error identifying missing required configuration value              | -      | -      |
| 8.4       | Display API error and exit non-zero on API failure                          | -      | -      |
