"use client";

import PuckEditorClient from "./PuckEditorClient";
import {
  createPageEditorAction,
  publishPageEditorAction,
  updatePageEditorAction,
} from "./pageEditorActions";
import { HassConnectWrapper } from "../Shared/util/HassConnectWrapper";
import { useMergedHAInstances } from "@repo/hooks";
import type { Entitlements } from "@repo/types/subscription";
import type { Data } from "@measured/puck";
import { Spinner } from "@heroui/react";

type PageEditorBodyProps = {
  entitlements: Entitlements;
  initialData?: Data;
  pageId?: string | null;
  initialPublished?: boolean;
  sidebars?: { id: string; name: string; slug: string }[];
  initialSlug?: string;
};

export default function PageEditorBody({
  entitlements,
  initialData,
  pageId,
  initialPublished = false,
  sidebars = [],
  initialSlug,
}: PageEditorBodyProps) {
  const { instances, loading } = useMergedHAInstances(entitlements);

  const haId =
    (initialData?.root?.props as { haInstanceId?: string } | undefined)
      ?.haInstanceId ?? instances[0]?.id;
  const activeHa = instances.find((i) => i.id === haId) ?? instances[0];

  const editor = (
    <PuckEditorClient
      type="page"
      initialData={initialData}
      itemId={pageId}
      initialPublished={initialPublished}
      haInstances={instances}
      sidebars={sidebars}
      initialSlug={initialSlug}
      maxItemsPerDashboard={entitlements.maxItemsPerDashboard}
      onCreateItem={createPageEditorAction}
      onUpdateItem={updatePageEditorAction}
      onPublishItem={publishPageEditorAction}
      editUrlTemplate="/setup/pages/edit/{slug}"
      viewUrlTemplate="/dashboard/{slug}"
      backUrl="/setup/pages"
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
