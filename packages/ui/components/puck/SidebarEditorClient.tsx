import type { Data } from "@measured/puck";
import SidebarEditorBody from "./SidebarEditorBody";
import { listThemes } from "@repo/lib/actions/themeActions";
import { HAConnectionActions } from "@repo/lib";

type ThemePickerOption = { id: string; name: string };

type SidebarEditorClientProps = {
  initialData?: Data;
  sidebarId?: string | null;
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
  const [themes, haConnection] = await Promise.all([
    listThemes(),
    HAConnectionActions.getHAConnection(),
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
      initialData={initialData}
      sidebarId={sidebarId}
      initialPublished={initialPublished}
      initialSlug={initialSlug}
      themePickerThemes={themePickerThemes}
      themeLibrary={themeLibrary}
      initialThemeId={initialThemeId}
      haConnection={haConnection}
    />
  );
}
