"use server";

import { createClient } from "../supabase/server";
import { getCurrentAuthUser } from "../supabase/server";
import { serverLogger } from "../logger";
import {
  Sidebar,
  CreateSidebarData,
  UpdateSidebarData,
} from "@repo/types/sidebar";
import { SubscriptionService } from "../services/subscriptionService";

export async function getAllSidebars(): Promise<Sidebar[]> {
  try {
    const user = await getCurrentAuthUser();

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sidebars")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message || "Failed to fetch sidebars");
    }

    const sidebars = (data ?? []) as unknown as Sidebar[];
    serverLogger.info(
      "getAllSidebars",
      `Retrieved ${sidebars.length} sidebars for user ${user.id}`
    );
    return sidebars;
  } catch (error) {
    serverLogger.error("getAllSidebars", "Failed to get sidebars", error);
    throw error;
  }
}

export async function getSidebar(slug: string): Promise<Sidebar> {
  try {
    const user = await getCurrentAuthUser();

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sidebars")
      .select("*")
      .eq("slug", slug)
      .eq("user_id", user.id)
      .single();

    if (error) {
      throw new Error(error.message || "Failed to fetch sidebar");
    }

    const sidebar = data as unknown as Sidebar;
    serverLogger.info(
      "getSidebar",
      `Retrieved sidebar ${slug} for user ${user.id}`
    );
    return sidebar;
  } catch (error) {
    serverLogger.error("getSidebar", `Failed to get sidebar ${slug}`, error);
    throw error;
  }
}

export async function createSidebar(
  sidebarData: CreateSidebarData
): Promise<Sidebar> {
  try {
    const user = await getCurrentAuthUser();

    const supabase = await createClient();

    // Check sidebar limits
    const { count } = await supabase
      .from("sidebars")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    const entitlements =
      await SubscriptionService.getEntitlementsForCurrentUser();
    if (
      entitlements.active &&
      entitlements.maxSidebars >= 0 &&
      (count ?? 0) >= entitlements.maxSidebars
    ) {
      throw new Error("Sidebar limit reached for your plan");
    }

    // Generate slug if not provided
    const finalData = {
      ...sidebarData,
      slug: sidebarData.slug || generateSlug(sidebarData.name),
    };

    const insertPayload = {
      ...finalData,
      user_id: user.id,
    } as Record<string, unknown>;

    const { data, error } = await supabase
      .from("sidebars")
      .insert(insertPayload)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message || "Failed to create sidebar");
    }

    const sidebar = data as unknown as Sidebar;
    serverLogger.info(
      "createSidebar",
      `Created sidebar ${sidebar.slug} for user ${user.id}`
    );
    return sidebar;
  } catch (error) {
    serverLogger.error("createSidebar", "Failed to create sidebar", error);
    throw error;
  }
}

export async function updateSidebar(
  slug: string,
  sidebarData: UpdateSidebarData
): Promise<Sidebar> {
  try {
    const user = await getCurrentAuthUser();

    const supabase = await createClient();

    serverLogger.info(
      "updateSidebar",
      `Looking for sidebar with slug: ${slug} for user: ${user.id}`
    );

    // First check if the sidebar exists and belongs to the user
    const { data: existingSidebar, error: fetchError } = await supabase
      .from("sidebars")
      .select("id, user_id, slug")
      .eq("slug", slug)
      .eq("user_id", user.id)
      .single();

    serverLogger.info("updateSidebar", `Found sidebar:`, {
      existingSidebar,
      fetchError,
    });

    if (fetchError || !existingSidebar) {
      serverLogger.error(
        "updateSidebar",
        `Sidebar not found. Error:`,
        fetchError
      );
      throw new Error("Sidebar not found or access denied");
    }

    // Now update the sidebar
    const { data, error } = await supabase
      .from("sidebars")
      .update(sidebarData as Record<string, unknown>)
      .eq("id", existingSidebar.id)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message || "Failed to update sidebar");
    }

    const sidebar = data as unknown as Sidebar;
    serverLogger.info(
      "updateSidebar",
      `Updated sidebar ${slug} for user ${user.id}`
    );
    return sidebar;
  } catch (error) {
    serverLogger.error(
      "updateSidebar",
      `Failed to update sidebar ${slug}`,
      error
    );
    throw error;
  }
}

export async function deleteSidebar(slug: string): Promise<void> {
  try {
    const user = await getCurrentAuthUser();

    const supabase = await createClient();
    const { error } = await supabase
      .from("sidebars")
      .delete()
      .eq("slug", slug)
      .eq("user_id", user.id);

    if (error) {
      throw new Error(error.message || "Failed to delete sidebar");
    }

    serverLogger.info(
      "deleteSidebar",
      `Deleted sidebar ${slug} for user ${user.id}`
    );
  } catch (error) {
    serverLogger.error(
      "deleteSidebar",
      `Failed to delete sidebar ${slug}`,
      error
    );
    throw error;
  }
}

export async function updateSidebarData(
  slug: string,
  puckData: any
): Promise<Sidebar> {
  try {
    const user = await getCurrentAuthUser();

    const supabase = await createClient();

    // First check if the sidebar exists and belongs to the user
    const { data: existingSidebar, error: fetchError } = await supabase
      .from("sidebars")
      .select("id, user_id")
      .eq("slug", slug)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingSidebar) {
      throw new Error("Sidebar not found or access denied");
    }

    // Now update the sidebar data
    const { data, error } = await supabase
      .from("sidebars")
      .update({ puck_data: puckData } as Record<string, unknown>)
      .eq("id", existingSidebar.id)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message || "Failed to update sidebar data");
    }

    const sidebar = data as unknown as Sidebar;
    serverLogger.info(
      "updateSidebarData",
      `Updated sidebar data for ${slug} for user ${user.id}`
    );
    return sidebar;
  } catch (error) {
    serverLogger.error(
      "updateSidebarData",
      `Failed to update sidebar data for ${slug}`,
      error
    );
    throw error;
  }
}

// Helper function for generating slugs
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
