"use server";

import { createClient, getCurrentAuthUser } from "../supabase/server";
import { serverLogger } from "../logger";
import type {
  CreateThemeInput,
  Theme,
  UpdateThemeInput,
} from "@repo/types/theme";
import { revalidatePath } from "next/cache";
import { assertThemeTokenKeys, sanitizeThemeTokens } from "../theme/validate";

export async function listThemes(): Promise<Theme[]> {
  const supabase = await createClient();
  const user = await getCurrentAuthUser();
  const { data, error } = await supabase
    .from("themes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Theme[];
}

export async function getTheme(id: string): Promise<Theme> {
  const supabase = await createClient();
  const user = await getCurrentAuthUser();
  const { data, error } = await supabase
    .from("themes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) throw new Error(error?.message || "Theme not found");
  return data as Theme;
}

export async function createTheme(input: CreateThemeInput): Promise<Theme> {
  const supabase = await createClient();
  const user = await getCurrentAuthUser();
  if (!input.name?.trim()) {
    throw new Error("Theme name is required");
  }
  const tokens = sanitizeThemeTokens(input.tokens ?? {});
  assertThemeTokenKeys(tokens);

  const { data, error } = await supabase
    .from("themes")
    .insert({
      user_id: user.id,
      name: input.name.trim(),
      tokens,
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/setup/themes");
  return data as Theme;
}

export async function updateTheme(
  id: string,
  input: UpdateThemeInput
): Promise<Theme> {
  const supabase = await createClient();
  const user = await getCurrentAuthUser();

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (input.name !== undefined) patch.name = input.name.trim();
  if (input.tokens !== undefined) {
    const tokens = sanitizeThemeTokens(input.tokens);
    assertThemeTokenKeys(tokens);
    patch.tokens = tokens;
  }

  const { data, error } = await supabase
    .from("themes")
    .update(patch)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/setup/themes");
  revalidatePath(`/setup/themes/${id}/edit`);
  return data as Theme;
}

export async function deleteTheme(id: string): Promise<void> {
  const supabase = await createClient();
  const user = await getCurrentAuthUser();
  const { error } = await supabase
    .from("themes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/setup/themes");
}

export async function duplicateTheme(id: string): Promise<Theme> {
  const existing = await getTheme(id);
  return createTheme({
    name: `${existing.name} (copy)`,
    tokens: existing.tokens,
  });
}
