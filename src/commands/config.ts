import { Command } from "commander";
import { loadConfig, saveConfig } from "../config/index.js";
import { print } from "../output.js";

export function configCommand(): Command {
  return new Command("config")
    .description("View or set configuration")
    .option("--host <host>", "API host")
    .option("--port <port>", "API port", (v) => parseInt(v, 10))
    .option("--api-key <key>", "API bearer token")
    .option("--project <slug>", "Default project slug")
    .action((options) => {
      const hasUpdates = options.host || options.port || options.apiKey || options.project;

      if (hasUpdates) {
        saveConfig({
          ...(options.host && { host: options.host }),
          ...(options.port && { port: options.port }),
          ...(options.apiKey && { apiKey: options.apiKey }),
          ...(options.project && { project: options.project }),
        });
      }

      print(loadConfig());
    });
}
