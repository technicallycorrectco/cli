import { client } from "../client/client.gen.js";
import { type Config, getBaseUrl } from "../config/index.js";

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
