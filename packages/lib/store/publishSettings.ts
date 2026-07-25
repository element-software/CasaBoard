import { readJson, writeJson } from "./jsonFile";

const FILE = "publish-settings.json";

export interface PublishSettings {
  /** Absolute or relative filesystem path where static exports are written. */
  publishDir: string;
  /** Public base URL for copy-link UI, e.g. http://homeassistant.local:8123/local/casaboard */
  publicBaseUrl: string;
}

export function defaultPublishSettings(): PublishSettings {
  return {
    publishDir: process.env.PUBLISH_DIR || "./publish",
    publicBaseUrl: "",
  };
}

export async function readPublishSettings(): Promise<PublishSettings> {
  const stored = await readJson<Partial<PublishSettings> | null>(FILE, null);
  const defaults = defaultPublishSettings();
  if (!stored) return defaults;
  return {
    publishDir:
      typeof stored.publishDir === "string" && stored.publishDir.trim()
        ? stored.publishDir.trim()
        : defaults.publishDir,
    publicBaseUrl:
      typeof stored.publicBaseUrl === "string"
        ? stored.publicBaseUrl.trim()
        : defaults.publicBaseUrl,
  };
}

export async function writePublishSettings(
  settings: PublishSettings
): Promise<PublishSettings> {
  const next: PublishSettings = {
    publishDir: settings.publishDir.trim() || defaultPublishSettings().publishDir,
    publicBaseUrl: settings.publicBaseUrl.trim(),
  };
  await writeJson(FILE, next);
  return next;
}
