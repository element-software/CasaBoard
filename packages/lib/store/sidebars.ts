import { randomUUID } from "crypto";
import type {
  CreateSidebarData,
  Sidebar,
  UpdateSidebarData,
} from "@repo/types/sidebar";
import { readJson, writeJson } from "./jsonFile";

const FILE = "sidebars.json";

type SidebarMap = Record<string, Sidebar>;

async function readAll(): Promise<SidebarMap> {
  return readJson<SidebarMap>(FILE, {});
}

export async function getAllSidebars(): Promise<Sidebar[]> {
  const all = await readAll();
  return Object.values(all).sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  );
}

export async function getSidebar(slug: string): Promise<Sidebar | null> {
  const all = await readAll();
  return all[slug] ?? null;
}

export async function getSidebarById(id: string): Promise<Sidebar | null> {
  const all = await readAll();
  return Object.values(all).find((s) => s.id === id) ?? null;
}

export async function createSidebar(
  data: CreateSidebarData
): Promise<Sidebar> {
  const all = await readAll();
  if (all[data.slug]) {
    throw new Error("A sidebar with this slug already exists");
  }
  const now = new Date().toISOString();
  const sidebar: Sidebar = {
    id: randomUUID(),
    name: data.name,
    slug: data.slug,
    puck_data: data.puck_data,
    theme_id: data.theme_id ?? null,
    created_at: now,
    updated_at: now,
  };
  all[sidebar.slug] = sidebar;
  await writeJson(FILE, all);
  return sidebar;
}

export async function updateSidebar(
  slug: string,
  data: UpdateSidebarData
): Promise<Sidebar> {
  const all = await readAll();
  const existing = all[slug];
  if (!existing) throw new Error("Sidebar not found");
  const updated: Sidebar = {
    ...existing,
    ...data,
    updated_at: new Date().toISOString(),
  };
  all[slug] = updated;
  await writeJson(FILE, all);
  return updated;
}

export async function deleteSidebar(slug: string): Promise<void> {
  const all = await readAll();
  delete all[slug];
  await writeJson(FILE, all);
}
