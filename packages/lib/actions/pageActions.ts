"use server";

import { createClient, getCurrentAuthUser } from "../supabase/server";
import { SubscriptionService } from "../services/subscriptionService";
import { CreatePageData, Page, UpdatePageData } from "@repo/types/page";
import { revalidatePath } from "next/cache";
import { assertPuckDataWithinItemLimit } from "../puck/assertPuckDataWithinItemLimit";
import { serverLogger } from "../logger";

export async function createPage(data: CreatePageData) {
  try {
    const supabase = await createClient();

    const user = await getCurrentAuthUser();

    // Check if slug already exists for this user
    const { data: existingPage } = await supabase
      .from("pages")
      .select("id")
      .eq("user_id", user.id)
      .eq("slug", data.slug)
      .single();

    if (existingPage) {
      throw new Error("A page with this slug already exists");
    }

    await assertPuckDataWithinItemLimit(data.puck_data);

    // Enforce entitlement: limit dashboards
    const { count: dashboardCount } = await supabase
      .from("pages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    const entitlements =
      await SubscriptionService.getEntitlementsForCurrentUser();
    if (
      entitlements.active &&
      entitlements.maxDashboards >= 0 &&
      (dashboardCount ?? 0) >= entitlements.maxDashboards
    ) {
      throw new Error("Dashboard limit reached for your plan");
    }

    const { data: page, error } = await supabase
      .from("pages")
      .insert({
        name: data.name,
        slug: data.slug,
        puck_data: data.puck_data,
        published: data.published ?? false,
        sidebar_id: data.sidebar_id ?? null,
        theme_id: data.theme_id ?? null,
        theme_overrides: data.theme_overrides ?? null,
        user_id: user.id,
      })
      .select(
        `
        *,
        sidebar:sidebars (
          id,
          name,
          slug,
          puck_data,
          theme_id,
          created_at,
          updated_at
        )
      `
      )
      .single();

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/setup/pages");
    return page;
  } catch (error) {
    serverLogger.error("pageActions.create", "Failed to create page", error);
    throw error;
  }
}

export async function updatePage(slug: string, data: UpdatePageData) {
  try {
    const supabase = await createClient();

    const user = await getCurrentAuthUser();

    if (data.puck_data !== undefined) {
      await assertPuckDataWithinItemLimit(data.puck_data);
    }

    const { data: page, error } = await supabase
      .from("pages")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("slug", slug)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Page not found");
      }
      throw new Error(error.message);
    }

    revalidatePath("/setup/pages");
    revalidatePath(`/${slug}`);
    return page;
  } catch (error) {
    serverLogger.error("pageActions.update", "Failed to update page", error);
    throw error;
  }
}

export async function deletePage(slug: string) {
  try {
    const supabase = await createClient();

    const user = await getCurrentAuthUser();

    const { error } = await supabase
      .from("pages")
      .delete()
      .eq("user_id", user.id)
      .eq("slug", slug);

    if (error) {
      throw new Error(error.message);
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
    const supabase = await createClient();

    const user = await getCurrentAuthUser();

    const { data: page, error } = await supabase
      .from("pages")
      .select(
        `*,
        sidebar:sidebars (
          id,
          name,
          slug,
          puck_data,
          theme_id,
          created_at,
          updated_at
        )`
      )
      .eq("user_id", user.id)
      .eq("slug", slug)
      .single();

    if (error || !page) {
      if (error?.code === "PGRST116") {
        throw new Error("Page not found");
      }
      throw new Error(error?.message);
    }

    return page;
  } catch (error) {
    serverLogger.error("pageActions.get", "Failed to get page", error);
    throw error;
  }
}

export async function getAllPages(): Promise<Page[]> {
  try {
    const supabase = await createClient();

    const user = await getCurrentAuthUser();

    const { data: pages, error } = await supabase
      .from("pages")
      .select(
        `*,
        sidebar:sidebars (
          id,
          name,
          slug,
          puck_data,
          theme_id,
          created_at,
          updated_at
        )`
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return pages;
  } catch (error) {
    serverLogger.error("pageActions.getAll", "Failed to get all pages", error);
    throw error;
  }
}

export async function getPageBySlug(slug: string): Promise<Page> {
  try {
    const supabase = await createClient();

    const user = await getCurrentAuthUser();

    // First, try to get the page
    const { data: page, error } = await supabase
      .from("pages")
      .select(
        `*,
        sidebar:sidebars (
          id,
          name,
          slug,
          puck_data,
          theme_id,
          created_at,
          updated_at
        )`
      )
      .eq("slug", slug)
      .single();

    if (error || !page) {
      if (error?.code === "PGRST116") {
        throw new Error("Page not found");
      }
      throw new Error(error?.message);
    }

    // Check access permissions
    const isPublished = page.published;
    const isOwner = user && page.user_id === user.id;

    // Allow access if page is published OR user is the owner
    if (!isPublished && !isOwner) {
      throw new Error("Page not found");
    }

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
