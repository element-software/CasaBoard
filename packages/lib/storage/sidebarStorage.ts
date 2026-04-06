import { Sidebar, CreateSidebarData, UpdateSidebarData } from "@repo/types/sidebar";
import { sidebarsKey, haInstancesKey } from "./storageKeys";
import {
  getCurrentUserId,
  readFromStorage,
  writeToStorage,
} from "./storageUtils";
import { StoredHAInstance } from "./haInstanceStorage";

export type StoredSidebar = Omit<Sidebar, "ha_instance"> & {
  user_id: string;
};

function readSidebars(userId: string): StoredSidebar[] {
  return readFromStorage<StoredSidebar[]>(sidebarsKey(userId)) ?? [];
}

function writeSidebars(userId: string, sidebars: StoredSidebar[]): void {
  writeToStorage(sidebarsKey(userId), sidebars);
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function resolveHAInstance(
  userId: string,
  ha_instance_id?: string | null
): Sidebar["ha_instance"] | undefined {
  if (!ha_instance_id) return undefined;
  const instances =
    readFromStorage<StoredHAInstance[]>(haInstancesKey(userId)) ?? [];
  return instances.find((i) => i.id === ha_instance_id) as Sidebar["ha_instance"];
}

function toSidebar(stored: StoredSidebar, userId: string): Sidebar {
  return {
    ...stored,
    ha_instance: resolveHAInstance(userId, stored.ha_instance_id),
  };
}

export async function getAllSidebars(): Promise<Sidebar[]> {
  const userId = await getCurrentUserId();
  return readSidebars(userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((s) => toSidebar(s, userId));
}

export async function getSidebar(slug: string): Promise<Sidebar> {
  const userId = await getCurrentUserId();
  const sidebar = readSidebars(userId).find((s) => s.slug === slug);
  if (!sidebar) throw new Error("Sidebar not found");
  return toSidebar(sidebar, userId);
}

export async function createSidebar(
  sidebarData: CreateSidebarData
): Promise<Sidebar> {
  const userId = await getCurrentUserId();
  const sidebars = readSidebars(userId);
  const now = new Date().toISOString();
  const slug = sidebarData.slug || generateSlug(sidebarData.name);

  const newSidebar: StoredSidebar = {
    id: crypto.randomUUID(),
    user_id: userId,
    name: sidebarData.name,
    slug,
    puck_data: sidebarData.puck_data,
    ha_instance_id: sidebarData.ha_instance_id ?? null,
    created_at: now,
    updated_at: now,
  };

  sidebars.push(newSidebar);
  writeSidebars(userId, sidebars);
  return toSidebar(newSidebar, userId);
}

export async function updateSidebar(
  slug: string,
  sidebarData: UpdateSidebarData
): Promise<Sidebar> {
  const userId = await getCurrentUserId();
  const sidebars = readSidebars(userId);
  const idx = sidebars.findIndex((s) => s.slug === slug && s.user_id === userId);
  if (idx === -1) throw new Error("Sidebar not found or access denied");

  const updated: StoredSidebar = {
    ...sidebars[idx],
    ...sidebarData,
    updated_at: new Date().toISOString(),
  };
  sidebars[idx] = updated;
  writeSidebars(userId, sidebars);
  return toSidebar(updated, userId);
}

export async function updateSidebarData(
  slug: string,
  puckData: any
): Promise<Sidebar> {
  return updateSidebar(slug, { puck_data: puckData });
}

export async function deleteSidebar(slug: string): Promise<void> {
  const userId = await getCurrentUserId();
  const sidebars = readSidebars(userId);
  writeSidebars(
    userId,
    sidebars.filter((s) => s.slug !== slug)
  );
}
