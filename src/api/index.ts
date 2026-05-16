import { client } from "../client/client.gen.js";
import { techcorWebApiOrganizationsControllerShow } from "../client/sdk.gen.js";
import { type Config, getBaseUrl, loadConfig, saveConfig } from "../config/index.js";

export function initClient(config: Config): void {
  const headers: Record<string, string> = {};
  if (config.apiKey) {
    headers["Authorization"] = `Bearer ${config.apiKey}`;
  }
  client.setConfig({
    baseUrl: getBaseUrl(config),
    headers,
  });
}

export async function resolveOrgSlug(): Promise<string> {
  const config = loadConfig();
  if (config.orgSlug) return config.orgSlug;

  const { data, error } = await techcorWebApiOrganizationsControllerShow();
  if (error || !data) throw new Error("Failed to resolve organization from API token");

  saveConfig({ orgSlug: data.slug });
  return data.slug;
}
