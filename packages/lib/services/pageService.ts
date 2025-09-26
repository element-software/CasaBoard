import { Data } from "@measured/puck";
import { Page, CreatePageData, UpdatePageData } from "@repo/types/page";
import { createClient } from "../supabase/client";

export class PageService {
  static async getAllPages(): Promise<Page[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message || "Failed to fetch pages");
    }

    return (data ?? []) as unknown as Page[];
  }

  static async getPage(slug: string): Promise<Page> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      throw new Error(error.message || "Failed to fetch page");
    }

    return data as unknown as Page;
  }

  static async createPage(pageData: CreatePageData): Promise<Page> {
    const supabase = createClient();

    // Attach current user_id for RLS compliance if required
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) throw new Error(userError.message || "Auth error");
    if (!user) throw new Error("Not authenticated");

    const insertPayload = { ...pageData, user_id: user.id } as Record<string, unknown>;

    const { data, error } = await supabase
      .from("pages")
      .insert(insertPayload)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message || "Failed to create page");
    }

    return data as unknown as Page;
  }

  static async updatePage(slug: string, pageData: UpdatePageData): Promise<Page> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pages")
      .update(pageData as Record<string, unknown>)
      .eq("slug", slug)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message || "Failed to update page");
    }

    return data as unknown as Page;
  }

  static async updatePageData(slug: string, puckData: Data): Promise<Page> {
    return this.updatePage(slug, { puck_data: puckData });
  }

  static async deletePage(slug: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("pages")
      .delete()
      .eq("slug", slug);

    if (error) {
      throw new Error(error.message || "Failed to delete page");
    }
  }

  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
