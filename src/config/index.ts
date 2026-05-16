import fs from "fs";
import path from "path";
import os from "os";

export type Config = {
  host: string;
  port: number;
  apiKey: string;
  orgSlug: string;
};

const CONFIG_PATH = path.join(os.homedir(), ".technicallycorrect", "cli", "config.json");

const DEFAULTS: Config = {
  host: "localhost",
  port: 4000,
  apiKey: "",
  orgSlug: "",
};

export function loadConfig(): Config {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveConfig(values: Partial<Config>): void {
  const current = loadConfig();
  const updated = { ...current, ...values };
  fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2));
}

export function getBaseUrl(config: Config): string {
  return `http://${config.host}:${config.port}/api/v1`;
}
