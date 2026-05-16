#!/usr/bin/env node
import { program } from "commander";
import { loadConfig } from "./config/index.js";
import { initClient } from "./api/index.js";
import { configCommand } from "./commands/config.js";
import { requirementsCommand } from "./commands/requirements.js";
import { tasksCommand } from "./commands/tasks.js";
import { implementationsCommand } from "./commands/implementations.js";
import { designsCommand } from "./commands/designs.js";
import { projectsCommand } from "./commands/projects.js";
import { initCommand } from "./commands/init.js";

const config = loadConfig();
initClient(config);

program.name("tc").description("Technically Correct CLI").version("1.0.0");

program.addCommand(configCommand());
program.addCommand(requirementsCommand(config));
program.addCommand(tasksCommand(config));
program.addCommand(implementationsCommand(config));
program.addCommand(designsCommand(config));
program.addCommand(projectsCommand());
program.addCommand(initCommand());

program.parse();
