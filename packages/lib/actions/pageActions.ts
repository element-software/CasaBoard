"use server";

import { CreatePageData, Page, UpdatePageData } from "@repo/types/page";
import { revalidatePath } from "next/cache";
import { serverLogger } from "../logger";
import * as PageStore from "../store/pages";
import {
  exportPublishedPage,
  removePublishedPage,
} from "../publish/exportPage";

async function syncPublishState(
  page: Page,
  previousPublished?: boolean
): Promise<void> {
  try {
    if (page.published) {
      await exportPublishedPage(page);
    } else if (previousPublished) {
      await removePublishedPage(page.slug);
    }
  } catch (error) {
    serverLogger.error(
      "pageActions.syncPublish",
      `Failed to sync static publish for ${page.slug}`,
      error
    );
    throw error;
  }
}

export async function createPage(data: CreatePageData): Promise<Page> {
  try {
    const page = await PageStore.createPage(data);
    revalidatePath("/setup/pages");
    if (page.published) {
      await syncPublishState(page, false);
    }
    return page;
  } catch (error) {
    serverLogger.error("pageActions.create", "Failed to create page", error);
    throw error;
  }
}

export async function updatePage(
  slug: string,
  data: UpdatePageData
): Promise<Page> {
  try {
    const existing = await PageStore.getPage(slug);
    const previousPublished = existing?.published ?? false;
    const page = await PageStore.updatePage(slug, data);
    revalidatePath("/setup/pages");
    revalidatePath(`/${slug}`);
    revalidatePath(`/dashboard/${slug}`);

    const publishedChanged =
      typeof data.published === "boolean" && data.published !== previousPublished;
    const contentChanged =
      data.puck_data !== undefined ||
      data.name !== undefined ||
      data.sidebar_id !== undefined ||
      data.theme_id !== undefined ||
      data.theme_overrides !== undefined ||
      data.style_id !== undefined;

    if (page.published && (publishedChanged || contentChanged || previousPublished)) {
      await syncPublishState(page, previousPublished);
    } else if (!page.published && previousPublished) {
      await syncPublishState(page, previousPublished);
    }

    return page;
  } catch (error) {
    serverLogger.error("pageActions.update", "Failed to update page", error);
    throw error;
  }
}

export async function deletePage(slug: string) {
  try {
    const existing = await PageStore.getPage(slug);
    await PageStore.deletePage(slug);
    if (existing?.published) {
      await removePublishedPage(slug);
    }
    revalidatePath("/setup/pages");
    return { success: true };
  } catch (error) {
    serverLogger.error("pageActions.delete", "Failed to delete page", error);
    throw error;
  }
}

export async function getPage(slug: string): Promise<Page> {
  try {
    const page = await PageStore.getPage(slug);
    if (!page) throw new Error("Page not found");
    return page;
  } catch (error) {
    serverLogger.error("pageActions.get", "Failed to get page", error);
    throw error;
  }
}

export async function getAllPages(): Promise<Page[]> {
  try {
    return await PageStore.getAllPages();
  } catch (error) {
    serverLogger.error("pageActions.getAll", "Failed to get all pages", error);
    throw error;
  }
}

export async function getPageBySlug(slug: string): Promise<Page> {
  try {
    const page = await PageStore.getPage(slug);
    if (!page) throw new Error("Page not found");
    return page;
  } catch (error) {
    serverLogger.error(
      "pageActions.getBySlug",
      "Failed to get page by slug",
      error
    );
    throw error;
  }
}
