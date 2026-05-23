#!/usr/bin/env node
import { program } from "commander";
import { loadConfig, isConfigured } from "./config/index.js";
import { initClient } from "./api/index.js";
import { configCommand } from "./commands/config.js";
import { requirementsCommand } from "./commands/requirements.js";
import { tasksCommand } from "./commands/tasks.js";
import { implementationsCommand } from "./commands/implementations.js";
import { designsCommand } from "./commands/designs.js";
import { projectsCommand } from "./commands/projects.js";
import { initCommand } from "./commands/init.js";

const config = loadConfig();

const subcommand = process.argv[2];
const skipConfigCheck = !subcommand || subcommand === "config" || subcommand === "init";

if (!skipConfigCheck && !isConfigured(config)) {
  console.error("tc is not configured. Run `tc config` to set your API key and org slug.");
  process.exit(1);
}

initClient(config);

program.name("tc").description("Technically Correct CLI").version("1.0.0");

program.addCommand(configCommand());
program.addCommand(requirementsCommand());
program.addCommand(tasksCommand());
program.addCommand(implementationsCommand());
program.addCommand(designsCommand());
program.addCommand(projectsCommand());
program.addCommand(initCommand());

program.parse();
