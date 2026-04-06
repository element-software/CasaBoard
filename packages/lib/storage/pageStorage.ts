import { Page, CreatePageData, UpdatePageData } from "@repo/types/page";
import { pagesKey, haInstancesKey, sidebarsKey } from "./storageKeys";
import {
  getCurrentUserId,
  readFromStorage,
  writeToStorage,
} from "./storageUtils";
import { StoredHAInstance } from "./haInstanceStorage";
import { StoredSidebar } from "./sidebarStorage";

type StoredPage = Omit<Page, "ha_instance" | "sidebar"> & {
  user_id: string;
};

function readPages(userId: string): StoredPage[] {
  return readFromStorage<StoredPage[]>(pagesKey(userId)) ?? [];
}

function writePages(userId: string, pages: StoredPage[]): void {
  writeToStorage(pagesKey(userId), pages);
}

function resolveRelations(page: StoredPage, userId: string): Page {
  let ha_instance: Page["ha_instance"] | undefined;
  let sidebar: Page["sidebar"] | undefined;

  if (page.ha_instance_id) {
    const instances =
      readFromStorage<StoredHAInstance[]>(haInstancesKey(userId)) ?? [];
    ha_instance = instances.find((i) => i.id === page.ha_instance_id) as
      | Page["ha_instance"]
      | undefined;
  }

  if (page.sidebar_id) {
    const sidebars =
      readFromStorage<StoredSidebar[]>(sidebarsKey(userId)) ?? [];
    const found = sidebars.find((s) => s.id === page.sidebar_id);
    if (found) {
      sidebar = {
        id: found.id,
        name: found.name,
        slug: found.slug,
        puck_data: found.puck_data,
        user_id: found.user_id,
        ha_instance_id: found.ha_instance_id,
        created_at: found.created_at,
        updated_at: found.updated_at,
      };
    }
  }

  return { ...page, ha_instance, sidebar };
}

export async function getAllPages(): Promise<Page[]> {
  const userId = await getCurrentUserId();
  return readPages(userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((p) => resolveRelations(p, userId));
}

export async function getPage(slug: string): Promise<Page> {
  const userId = await getCurrentUserId();
  const page = readPages(userId).find((p) => p.slug === slug);
  if (!page) throw new Error("Page not found");
  return resolveRelations(page, userId);
}

export async function getPageBySlug(slug: string): Promise<Page> {
  return getPage(slug);
}

export async function createPage(data: CreatePageData): Promise<Page> {
  const userId = await getCurrentUserId();
  const pages = readPages(userId);

  if (pages.some((p) => p.slug === data.slug)) {
    throw new Error("A page with this slug already exists");
  }

  const now = new Date().toISOString();
  const newPage: StoredPage = {
    id: crypto.randomUUID(),
    user_id: userId,
    name: data.name,
    slug: data.slug,
    puck_data: data.puck_data,
    published: data.published ?? false,
    ha_instance_id: data.ha_instance_id ?? null,
    sidebar_id: data.sidebar_id ?? null,
    created_at: now,
    updated_at: now,
  };

  pages.push(newPage);
  writePages(userId, pages);
  return resolveRelations(newPage, userId);
}

export async function updatePage(
  slug: string,
  data: UpdatePageData
): Promise<Page> {
  const userId = await getCurrentUserId();
  const pages = readPages(userId);
  const idx = pages.findIndex((p) => p.slug === slug && p.user_id === userId);
  if (idx === -1) throw new Error("Page not found");

  const updated: StoredPage = {
    ...pages[idx],
    ...data,
    updated_at: new Date().toISOString(),
  };
  pages[idx] = updated;
  writePages(userId, pages);
  return resolveRelations(updated, userId);
}

export async function deletePage(slug: string): Promise<{ success: true }> {
  const userId = await getCurrentUserId();
  const pages = readPages(userId);
  writePages(
    userId,
    pages.filter((p) => p.slug !== slug)
  );
  return { success: true };
}
