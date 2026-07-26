"use server";

import { CreatePageData, Page, UpdatePageData } from "@repo/types/page";
import { revalidatePath } from "next/cache";
import { serverLogger } from "../logger";
import * as PageStore from "../store/pages";

export async function createPage(data: CreatePageData): Promise<Page> {
  try {
    const page = await PageStore.createPage(data);
    revalidatePath("/setup/pages");
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
    const page = await PageStore.updatePage(slug, data);
    revalidatePath("/setup/pages");
    revalidatePath(`/${slug}`);
    revalidatePath(`/dashboard/${slug}`);
    return page;
  } catch (error) {
    serverLogger.error("pageActions.update", "Failed to update page", error);
    throw error;
  }
}

export async function deletePage(slug: string) {
  try {
    await PageStore.deletePage(slug);
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
