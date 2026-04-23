"use client";

import PuckEditorClient from "./PuckEditorClient";
import {
  createSidebarEditorAction,
  updateSidebarEditorAction,
} from "./sidebarEditorActions";
import { useMergedHAInstances } from "@repo/hooks";
import { HassConnectWrapper } from "../Shared/util/HassConnectWrapper";
import type { Entitlements } from "@repo/types/subscription";
import type { Data } from "@measured/puck";
import type { ThemeTokens } from "@repo/types/theme";
import { Spinner } from "@heroui/react";

type ThemePickerOption = { id: string; name: string };
type ThemeLibraryEntry = { id: string; tokens: ThemeTokens };

type SidebarEditorBodyProps = {
  entitlements: Entitlements;
  initialData?: Data;
  sidebarId?: string | null;
  initialPublished?: boolean;
  initialSlug?: string;
  themePickerThemes?: ThemePickerOption[];
  themeLibrary?: ThemeLibraryEntry[];
  initialThemeId?: string | null;
};

export default function SidebarEditorBody({
  entitlements,
  initialData,
  sidebarId,
  initialPublished = true,
  initialSlug,
  themePickerThemes = [],
  themeLibrary = [],
  initialThemeId,
}: SidebarEditorBodyProps) {
  const { instances, loading } = useMergedHAInstances(entitlements);

  const haId =
    (initialData?.root?.props as { haInstanceId?: string } | undefined)
      ?.haInstanceId ?? instances[0]?.id;
  const activeHa = instances.find((i) => i.id === haId) ?? instances[0];

  const editor = (
    <PuckEditorClient
      type="sidebar"
      initialData={initialData}
      itemId={sidebarId}
      initialPublished={initialPublished}
      haInstances={instances}
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

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (activeHa) {
    return <HassConnectWrapper haInstance={activeHa}>{editor}</HassConnectWrapper>;
  }

  return editor;
}
