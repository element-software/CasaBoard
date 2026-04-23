import type { Data } from "@measured/puck";
import SidebarEditorBody from "./SidebarEditorBody";
import { SubscriptionService } from "@repo/lib";
import { listThemes } from "@repo/lib/actions/themeActions";

type ThemePickerOption = { id: string; name: string };

type SidebarEditorClientProps = {
  initialData?: Data;
  sidebarId?: string | null;
  userId?: string | null;
  initialPublished?: boolean;
  initialSlug?: string;
  initialThemeId?: string | null;
};

export default async function SidebarEditorClient({
  initialData,
  sidebarId,
  initialPublished = true,
  initialSlug,
  initialThemeId,
}: SidebarEditorClientProps) {
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
    <SidebarEditorBody
      entitlements={entitlements}
      initialData={initialData}
      sidebarId={sidebarId}
      initialPublished={initialPublished}
      initialSlug={initialSlug}
      themePickerThemes={themePickerThemes}
      themeLibrary={themeLibrary}
      initialThemeId={initialThemeId}
    />
  );
}
