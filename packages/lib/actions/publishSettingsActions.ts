"use server";

import {
  readPublishSettings,
  writePublishSettings,
  type PublishSettings,
} from "../store/publishSettings";

export async function getPublishSettings(): Promise<PublishSettings> {
  return readPublishSettings();
}

export async function savePublishSettings(
  settings: PublishSettings
): Promise<PublishSettings> {
  return writePublishSettings(settings);
}

export async function getPublishedPagePublicUrl(
  slug: string
): Promise<string | null> {
  const settings = await readPublishSettings();
  if (!settings.publicBaseUrl) return null;
  const base = settings.publicBaseUrl.replace(/\/+$/, "");
  return `${base}/${slug}/`;
}
