import type { Data } from "@measured/puck";
import type { ThemeTokens } from "@repo/types/theme";
import PageEditorBody from "./PageEditorBody";
import { SubscriptionService } from "@repo/lib";
import { listThemes } from "@repo/lib/actions/themeActions";

type ThemePickerOption = { id: string; name: string };

type PageEditorClientProps = {
  initialData?: Data;
  pageId?: string | null;
  userId?: string | null;
  initialPublished?: boolean;
  sidebars?: { id: string; name: string; slug: string }[];
  initialSlug?: string;
  initialThemeId?: string | null;
  initialThemeOverrides?: ThemeTokens | null;
};

export default async function PageEditorClient({
  initialData,
  pageId,
  initialPublished = false,
  sidebars = [],
  initialSlug,
  initialThemeId,
  initialThemeOverrides,
}: PageEditorClientProps) {
  const [entitlements, themes] = await Promise.all([
    SubscriptionService.getEntitlementsForCurrentUser(),
    listThemes(),
  ]);

  const themePickerThemes: ThemePickerOption[] = themes.map((t) => ({
    id: t.id,
    name: t.name,
  }));

  const themeLibrary = themes.map((t) => ({
    id: t.id,
    tokens: t.tokens ?? {},
  }));

  return (
    <PageEditorBody
      entitlements={entitlements}
      initialData={initialData}
      pageId={pageId}
      initialPublished={initialPublished}
      sidebars={sidebars}
      initialSlug={initialSlug}
      themePickerThemes={themePickerThemes}
      themeLibrary={themeLibrary}
      initialThemeId={initialThemeId}
      initialThemeOverrides={initialThemeOverrides}
    />
  );
}
