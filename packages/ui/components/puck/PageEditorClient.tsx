"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@heroui/react";
import PuckEditorClient from "./PuckEditorClient";
import { HAInstanceStorage, PageStorage, SidebarStorage } from "@repo/lib";
import { HassConnectWrapper } from "@repo/ui/components/Shared/util/HassConnectWrapper";
import { HAInstance } from "@repo/types/ha";

type PageEditorClientProps = {
  /** When provided, loads this page from localStorage (edit mode). */
  initialSlug?: string;
};

export default function PageEditorClient({ initialSlug }: PageEditorClientProps) {
  const [loading, setLoading] = useState(true);
  const [haInstances, setHaInstances] = useState<
    { id: string; name: string; hass_url: string }[]
  >([]);
  const [sidebars, setSidebars] = useState<
    { id: string; name: string; slug: string }[]
  >([]);
  const [initialData, setInitialData] = useState<any>(undefined);
  const [pageId, setPageId] = useState<string | null>(null);
  const [initialPublished, setInitialPublished] = useState(false);
  const [haInstance, setHaInstance] = useState<HAInstance | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [instances, allSidebars] = await Promise.all([
          HAInstanceStorage.listHAInstances(),
          SidebarStorage.getAllSidebars(),
        ]);
        setHaInstances(instances);
        setSidebars(allSidebars);

        if (initialSlug) {
          const page = await PageStorage.getPage(initialSlug);
          setInitialData(page.puck_data);
          setPageId(page.id);
          setInitialPublished(page.published);
          if (page.ha_instance) {
            setHaInstance({ ...page.ha_instance, hass_token: "" });
          }
        }
      } catch (e) {
        console.error("PageEditorClient: failed to load data", e);
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
      type="page"
      initialData={initialData}
      itemId={pageId}
      initialPublished={initialPublished}
      haInstances={haInstances}
      sidebars={sidebars}
      initialSlug={initialSlug}
      onCreateItem={(data: any) => PageStorage.createPage(data)}
      onUpdateItem={(slug: string, data: any) => PageStorage.updatePage(slug, data)}
      onPublishItem={(slug: string, published: boolean) =>
        PageStorage.updatePage(slug, { published })
      }
      editUrlTemplate="/setup/pages/edit/{slug}"
      viewUrlTemplate="/dashboard/{slug}"
      backUrl="/setup/pages"
    />
  );

  if (initialSlug && haInstance) {
    return <HassConnectWrapper haInstance={haInstance}>{editor}</HassConnectWrapper>;
  }

  return editor;
}