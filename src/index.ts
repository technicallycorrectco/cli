#!/usr/bin/env node
import { fail } from "./output.js";
process.on("unhandledRejection", (reason) => {
  const message = reason instanceof Error ? reason.message : String(reason);
  fail(message);
});

import { program } from "commander";
import { loadConfig, isConfigured } from "./config/index.js";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version } = require("../package.json") as { version: string };
import { initClient } from "./api/index.js";
import { configCommand } from "./commands/config.js";
import { requirementsCommand } from "./commands/requirements.js";
import { tasksCommand } from "./commands/tasks.js";
import { implementationsCommand } from "./commands/implementations.js";
import { projectsCommand } from "./commands/projects.js";
import { initCommand, checkStaleness, collectAllFiles } from "./commands/init.js";

const config = loadConfig();

const subcommand = process.argv[2];
const args = process.argv.slice(2);
const skipConfigCheck =
  !subcommand ||
  subcommand === "config" ||
  subcommand === "init" ||
  subcommand === "help" ||
  args.includes("--help") ||
  args.includes("-h") ||
  args.includes("-v") ||
  args.includes("--version");

if (!skipConfigCheck && !isConfigured(config)) {
  fail("tc is not configured. Run `tc config` to set your API key");
}

initClient(config);

if (!skipConfigCheck) {
  checkStaleness(collectAllFiles());
}

program.name("tc").description("Technically Correct CLI").version(version, "-v, --version");

program.addCommand(configCommand());
program.addCommand(initCommand());
program.addCommand(requirementsCommand());
program.addCommand(tasksCommand());
program.addCommand(implementationsCommand());
program.addCommand(projectsCommand());

program.parse();
