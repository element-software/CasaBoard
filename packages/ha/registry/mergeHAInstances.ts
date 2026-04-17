import type { HAInstance } from "@repo/types/ha";
import type { LocalHAEntry } from "./localHARegistry";

export type CloudHARow = {
  id: string;
  name: string;
  hass_url: string;
  created_at?: string;
};

/**
 * When cloud sync is on, server rows override name/url for matching ids.
 */
export function mergeRegistryWithCloud(
  local: LocalHAEntry[],
  cloud: CloudHARow[],
  applyCloud: boolean
): LocalHAEntry[] {
  if (!applyCloud || cloud.length === 0) return local;
  const map = new Map<string, LocalHAEntry>();
  for (const e of local) map.set(e.id, e);
  for (const c of cloud) {
    map.set(c.id, {
      id: c.id,
      name: c.name,
      hass_url: c.hass_url,
      source: "cloud",
    });
  }
  return Array.from(map.values());
}

export function toHAInstance(entry: LocalHAEntry): HAInstance {
  return {
    id: entry.id,
    name: entry.name,
    hass_url: entry.hass_url,
    hass_token: "",
    created_at: new Date().toISOString(),
    source: entry.source,
  };
}

export function resolveHAInstanceById(
  id: string | undefined | null,
  merged: LocalHAEntry[]
): HAInstance | null {
  if (!id) return null;
  const hit = merged.find((e) => e.id === id);
  return hit ? toHAInstance(hit) : null;
}
