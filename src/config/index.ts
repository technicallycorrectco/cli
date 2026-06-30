import fs from "fs";
import path from "path";
import os from "os";
import { fail } from "../output.js";

export type Config = {
  host: string;
  port: number;
  apiKey: string;
  orgSlug: string;
  project?: string;
};

type SettingsFile = {
  cli?: Partial<Config>;
};

const GLOBAL_SETTINGS_PATH = path.join(os.homedir(), ".technicallycorrect", "settings.json");
const LOCAL_SETTINGS_FILE = path.join(".technicallycorrect", "settings.json");

const DEFAULTS: Config = {
  host: "localhost",
  port: 4000,
  apiKey: "",
  orgSlug: "",
};

function readSettingsFile(filePath: string): Partial<Config> {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as SettingsFile;
    return parsed.cli ?? {};
  } catch {
    return {};
  }
}

function findLocalSettingsPath(): string | null {
  let dir = process.cwd();
  while (true) {
    const candidate = path.join(dir, LOCAL_SETTINGS_FILE);
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

export function loadConfig(): Config {
  const global = readSettingsFile(GLOBAL_SETTINGS_PATH);
  const localPath = findLocalSettingsPath();
  const local = localPath ? readSettingsFile(localPath) : {};
  return { ...DEFAULTS, ...global, ...local };
}

export function saveConfig(values: Partial<Config>): void {
  const current = readSettingsFile(GLOBAL_SETTINGS_PATH);
  const updated = { ...current, ...values };
  const settings: SettingsFile = { cli: updated };
  fs.mkdirSync(path.dirname(GLOBAL_SETTINGS_PATH), { recursive: true });
  fs.writeFileSync(GLOBAL_SETTINGS_PATH, JSON.stringify(settings, null, 2));
}

export function saveLocalConfig(dir: string, values: Partial<Config>): void {
  const filePath = path.join(dir, LOCAL_SETTINGS_FILE);
  const current = readSettingsFile(filePath);
  const updated = { ...current, ...values };
  const settings: SettingsFile = { cli: updated };
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
}

export function resolveProject(flagValue: string | undefined): string {
  if (flagValue) return flagValue;
  const config = loadConfig();
  if (config.project) return config.project;
  fail("--project is required");
}

export function getBaseUrl(config: Config): string {
  return `http://${config.host}:${config.port}`;
}

export function isConfigured(config: Config): boolean {
  return !!config.apiKey && !!config.orgSlug;
}
