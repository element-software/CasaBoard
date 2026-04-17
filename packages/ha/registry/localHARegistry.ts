/**
 * Browser-only Home Assistant instance metadata (URL + label).
 * Tokens remain in encrypted storage via browserToken.ts — never persisted here as secrets.
 */

export const REGISTRY_KEY = "casaboard-ha-registry-v1";

export type LocalHAEntry = {
  id: string;
  name: string;
  hass_url: string;
  source: "local" | "cloud";
};

function notifyRegistryChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("casaboard-ha-registry-changed"));
}

export function listLocalRegistry(): LocalHAEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalHAEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalRegistry(entries: LocalHAEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(entries));
  notifyRegistryChanged();
}

export function upsertLocalEntry(entry: LocalHAEntry): void {
  const list = listLocalRegistry().filter((e) => e.id !== entry.id);
  list.push(entry);
  saveLocalRegistry(list);
}

export function removeLocalEntry(id: string): void {
  saveLocalRegistry(listLocalRegistry().filter((e) => e.id !== id));
}

/** Create a new local-only instance row (no server write). */
export function addLocalInstance(name: string, hass_url: string): LocalHAEntry {
  const id = crypto.randomUUID();
  const entry: LocalHAEntry = { id, name, hass_url, source: "local" };
  upsertLocalEntry(entry);
  return entry;
}
