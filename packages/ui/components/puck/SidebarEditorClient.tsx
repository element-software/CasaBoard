"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@heroui/react";
import PuckEditorClient from "./PuckEditorClient";
import { HAInstanceStorage, SidebarStorage } from "@repo/lib";
import { HassConnectWrapper } from "@repo/ui/components/Shared/util/HassConnectWrapper";
import { HAInstance } from "@repo/types/ha";

type SidebarEditorClientProps = {
  /** When provided, loads this sidebar from localStorage (edit mode). */
  initialSlug?: string;
};

export default function SidebarEditorClient({
  initialSlug,
}: SidebarEditorClientProps) {
  const [loading, setLoading] = useState(true);
  const [haInstances, setHaInstances] = useState<
    { id: string; name: string; hass_url: string }[]
  >([]);
  const [initialData, setInitialData] = useState<any>(undefined);
  const [sidebarId, setSidebarId] = useState<string | null>(null);
  const [haInstance, setHaInstance] = useState<HAInstance | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const instances = await HAInstanceStorage.listHAInstances();
        setHaInstances(instances);

        if (initialSlug) {
          const sidebar = await SidebarStorage.getSidebar(initialSlug);
          setInitialData(sidebar.puck_data);
          setSidebarId(sidebar.id);
          if (sidebar.ha_instance) {
            setHaInstance({ ...sidebar.ha_instance, hass_token: "" });
          }
        }
      } catch (e) {
        console.error("SidebarEditorClient: failed to load data", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [initialSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  const editor = (
    <PuckEditorClient
      type="sidebar"
      initialData={initialData}
      itemId={sidebarId}
      initialPublished={true}
      haInstances={haInstances}
      initialSlug={initialSlug}
      onCreateItem={(data: any) => SidebarStorage.createSidebar(data)}
      onUpdateItem={(slug: string, data: any) =>
        SidebarStorage.updateSidebar(slug, data)
      }
      editUrlTemplate="/setup/sidebars/edit/{slug}"
      backUrl="/setup/sidebars"
    />
  );

  if (initialSlug && haInstance) {
    return <HassConnectWrapper haInstance={haInstance}>{editor}</HassConnectWrapper>;
  }

  return editor;
}
