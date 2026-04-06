import { HAInstance } from "@repo/types/ha";
import { haInstancesKey } from "./storageKeys";
import {
  getCurrentUserId,
  readFromStorage,
  writeToStorage,
} from "./storageUtils";

export type StoredHAInstance = Pick<HAInstance, "id" | "name" | "hass_url"> & {
  created_at: string;
  updated_at: string;
};

function readInstances(userId: string): StoredHAInstance[] {
  return readFromStorage<StoredHAInstance[]>(haInstancesKey(userId)) ?? [];
}

function writeInstances(userId: string, instances: StoredHAInstance[]): void {
  writeToStorage(haInstancesKey(userId), instances);
}

export async function listHAInstances(): Promise<StoredHAInstance[]> {
  const userId = await getCurrentUserId();
  return readInstances(userId).sort((a, b) =>
    a.created_at.localeCompare(b.created_at)
  );
}

export async function createHAInstance(input: {
  name: string;
  hass_url: string;
}): Promise<StoredHAInstance> {
  const userId = await getCurrentUserId();
  const instances = readInstances(userId);
  const now = new Date().toISOString();
  const newInstance: StoredHAInstance = {
    id: crypto.randomUUID(),
    name: input.name,
    hass_url: input.hass_url,
    created_at: now,
    updated_at: now,
  };
  instances.push(newInstance);
  writeInstances(userId, instances);
  return newInstance;
}

export async function deleteHAInstance(id?: string): Promise<{ success: true }> {
  const userId = await getCurrentUserId();
  const instances = readInstances(userId);
  writeInstances(
    userId,
    id ? instances.filter((i) => i.id !== id) : []
  );
  return { success: true };
}

export async function getHAInstance(
  id: string
): Promise<StoredHAInstance | null> {
  const userId = await getCurrentUserId();
  return readInstances(userId).find((i) => i.id === id) ?? null;
}

export async function getFirstHAInstance(): Promise<StoredHAInstance | null> {
  const userId = await getCurrentUserId();
  const sorted = readInstances(userId).sort((a, b) =>
    a.created_at.localeCompare(b.created_at)
  );
  return sorted[0] ?? null;
}

export async function getHAInstanceByHassUrl(
  hassUrl: string
): Promise<StoredHAInstance | null> {
  const userId = await getCurrentUserId();
  return readInstances(userId).find((i) => i.hass_url === hassUrl) ?? null;
}

export async function updateHAInstance(
  data: Partial<StoredHAInstance> & { id: string }
): Promise<StoredHAInstance | null> {
  const userId = await getCurrentUserId();
  const instances = readInstances(userId);
  const idx = instances.findIndex((i) => i.id === data.id);
  if (idx === -1) return null;
  const updated: StoredHAInstance = {
    ...instances[idx],
    ...data,
    updated_at: new Date().toISOString(),
  };
  instances[idx] = updated;
  writeInstances(userId, instances);
  return updated;
}
