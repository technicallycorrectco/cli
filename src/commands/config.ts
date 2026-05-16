import { Command } from "commander";
import { loadConfig, saveConfig } from "../config/index.js";
import { print } from "../output.js";

export function configCommand(): Command {
  return new Command("config")
    .description("View or set configuration")
    .option("--host <host>", "API host")
    .option("--port <port>", "API port", (v) => parseInt(v, 10))
    .option("--api-key <key>", "API bearer token")
    .action((options) => {
      const hasUpdates = options.host || options.port || options.apiKey;

      if (hasUpdates) {
        saveConfig({
          ...(options.host && { host: options.host }),
          ...(options.port && { port: options.port }),
          ...(options.apiKey && { apiKey: options.apiKey }),
        });
      }

      print(loadConfig());
    });
}
