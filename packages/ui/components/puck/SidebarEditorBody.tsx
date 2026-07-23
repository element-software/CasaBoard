"use client";

import PuckEditorClient from "./PuckEditorClient";
import {
  createSidebarEditorAction,
  updateSidebarEditorAction,
} from "./sidebarEditorActions";
import { HassConnectWrapper } from "../Shared/util/HassConnectWrapper";
import type { HAConnection } from "@repo/types/ha";
import type { Data } from "@measured/puck";
import type { ThemeTokens } from "@repo/types/theme";

type ThemePickerOption = { id: string; name: string };
type ThemeLibraryEntry = { id: string; tokens: ThemeTokens };

type SidebarEditorBodyProps = {
  initialData?: Data;
  sidebarId?: string | null;
  initialPublished?: boolean;
  initialSlug?: string;
  themePickerThemes?: ThemePickerOption[];
  themeLibrary?: ThemeLibraryEntry[];
  initialThemeId?: string | null;
  haConnection?: HAConnection | null;
};

export default function SidebarEditorBody({
  initialData,
  sidebarId,
  initialPublished = true,
  initialSlug,
  themePickerThemes = [],
  themeLibrary = [],
  initialThemeId,
  haConnection = null,
}: SidebarEditorBodyProps) {
  const editor = (
    <PuckEditorClient
      type="sidebar"
      initialData={initialData}
      itemId={sidebarId}
      initialPublished={initialPublished}
      initialSlug={initialSlug}
      themePickerThemes={themePickerThemes}
      themeLibrary={themeLibrary}
      initialThemeId={initialThemeId}
      onCreateItem={createSidebarEditorAction}
      onUpdateItem={updateSidebarEditorAction}
      editUrlTemplate="/setup/sidebars/edit/{slug}"
      backUrl="/setup/sidebars"
    />
  );

  if (haConnection) {
    return <HassConnectWrapper haInstance={haConnection}>{editor}</HassConnectWrapper>;
  }

  return editor;
}
