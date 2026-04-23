import type { CSSProperties } from "react";
import type { Page } from "@repo/types/page";
import { createClient } from "../supabase/server";
import { mergeThemeLayers, resolvedTokensToCssVars } from "./merge";
import { sanitizeThemeTokens } from "./validate";

export async function resolveDashboardThemeStyles(
  page: Page
): Promise<{ main: CSSProperties; sidebar: CSSProperties }> {
  const supabase = await createClient();

  let themeLayer: Record<string, string> = {};
  if (page.theme_id) {
    const { data } = await supabase
      .from("themes")
      .select("tokens")
      .eq("id", page.theme_id)
      .maybeSingle();
    if (data?.tokens) {
      themeLayer = sanitizeThemeTokens(data.tokens) as Record<string, string>;
    }
  }

  const overrides = sanitizeThemeTokens(
    (page.theme_overrides as Record<string, unknown> | null) ?? {}
  );

  const mainResolved = mergeThemeLayers(themeLayer, overrides);

  let sidebarResolved = mainResolved;
  if (page.sidebar?.theme_id) {
    const { data: sb } = await supabase
      .from("themes")
      .select("tokens")
      .eq("id", page.sidebar.theme_id)
      .maybeSingle();
    if (sb?.tokens) {
      sidebarResolved = mergeThemeLayers(
        sanitizeThemeTokens(sb.tokens) as Record<string, string>
      );
    } else {
      sidebarResolved = mergeThemeLayers();
    }
  }

  return {
    main: resolvedTokensToCssVars(mainResolved),
    sidebar: resolvedTokensToCssVars(sidebarResolved),
  };
}
