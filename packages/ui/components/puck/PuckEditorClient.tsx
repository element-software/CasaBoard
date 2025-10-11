"use client";

import { Puck, Data } from "@measured/puck";
import { PuckConfig } from "./puck.config";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Link
} from "@heroui/react";
import "@measured/puck/puck.css";
import { useRouter } from "next/navigation";
import { clientLogger } from "@repo/lib";

type PuckEditorClientProps = {
  type: "page" | "sidebar"; // Generic type name for display purposes
  initialData?: Data;
  itemId?: string | null;
  initialPublished?: boolean;
  haInstances?: { id: string; name: string; hass_url: string }[];
  sidebars?: { id: string; name: string; slug: string }[];
  initialSlug?: string;
  // Publish functions passed as props
  onCreateItem: (data: { name: string; slug: string; puck_data: Data; [key: string]: any }) => Promise<any>;
  onUpdateItem: (slug: string, data: { name?: string; puck_data?: Data; [key: string]: any }) => Promise<any>;
  onPublishItem?: (slug: string, published: boolean) => Promise<any>; // Optional for items that don't have publish state
  // Navigation URLs passed as strings
  editUrlTemplate: string; // e.g., "/setup/pages/edit/{slug}"
  viewUrlTemplate?: string; // e.g., "/dashboard/{slug}"
  backUrl: string; // e.g., "/setup/pages"
};

export default function PuckEditorClient({
  type,
  initialData,
  itemId,
  initialPublished = false,
  haInstances = [],
  sidebars = [],
  initialSlug,
  onCreateItem,
  onUpdateItem,
  onPublishItem,
  editUrlTemplate,
  viewUrlTemplate,
  backUrl,
}: PuckEditorClientProps) {
  const [data, setData] = useState<Data>(
    initialData || { content: [], root: { props: {} } }
  );
  const [lastSavedJson, setLastSavedJson] = useState<string>(
    JSON.stringify(initialData || { content: [], root: { props: {} } })
  );
  const [currentItemId, setCurrentItemId] = useState<string | null>(
    itemId || null
  );
  const [isPublished, setIsPublished] = useState<boolean>(initialPublished);
  const [isPublishPending, startPublishTransition] = useTransition();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<{
    title: string;
    slug: string;
    haInstanceId?: string | null;
    sidebarId?: string | null;
  }>(() => {
    const props = (initialData?.root?.props as any) || {};
    return {
      title: props.title || `New ${type === "page" ? "Page" : "Sidebar"}`,
      slug: initialSlug || props.slug || `new-${type}`,
      haInstanceId: props.haInstanceId || haInstances[0]?.id || undefined,
      sidebarId: props.sidebarId || null,
    };
  });

  // For existing items, we should not allow slug changes
  const isExistingItem = !!currentItemId;
  const router = useRouter();

  // Open settings immediately on create (no currentItemId) so user can enter a name
  useEffect(() => {
    if (!currentItemId) {
      setIsSettingsOpen(true);
    }
  }, [currentItemId]);

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  const isDirty = useMemo(() => {
    try {
      return JSON.stringify(data) !== lastSavedJson;
    } catch {
      return true;
    }
  }, [data, lastSavedJson]);

  const saveItem = async () => {
    setError(null);
    try {
      const createData = {
        name: settings.title,
        slug: settings.slug,
        puck_data: data,
        ...(haInstances.length > 0 && { ha_instance_id: settings.haInstanceId }),
        ...(sidebars.length > 0 && { sidebar_id: settings.sidebarId }),
      };
      
      const result = await onCreateItem(createData);
      setCurrentItemId(result.id);
      setLastSavedJson(JSON.stringify(data));
      clientLogger.info("PuckEditorClient", `${type} created successfully`, result);
      router.push(editUrlTemplate.replace('{slug}', result.slug));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save";
      setError(errorMessage);
      clientLogger.error("PuckEditorClient", "Save failed", err);
    }
  };

  const updateItem = async () => {
    setError(null);
    try {
      const updateData = {
        name: settings.title,
        puck_data: data,
        ...(haInstances.length > 0 && { ha_instance_id: settings.haInstanceId }),
        ...(sidebars.length > 0 && { sidebar_id: settings.sidebarId }),
      };
      
      const slugToUse = initialSlug || settings.slug;
      await onUpdateItem(slugToUse, updateData);
      setLastSavedJson(JSON.stringify(data));
      clientLogger.info("PuckEditorClient", `${type} updated successfully`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update";
      setError(errorMessage);
      clientLogger.error("PuckEditorClient", "Update failed", err);
    }
  };

  const publish = async () => {
    if (!currentItemId) {
      await saveItem();
    } else {
      await updateItem();
      if (onPublishItem) {
        startPublishTransition(async () => {
          try {
            await onPublishItem(initialSlug || settings.slug, true);
            setIsPublished(true);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to publish");
            clientLogger.error("PuckEditorClient", "Publish failed", err);
          }
        });
      } else {
        // For items without publish state (like sidebars), just mark as published
        setIsPublished(true);
      }
    }
  };

  const updatePublished = async () => {
    if (!currentItemId) return;
    
    if (onPublishItem) {
      startPublishTransition(async () => {
        try {
          await onPublishItem(initialSlug || settings.slug, !isPublished);
          setIsPublished(!isPublished);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to update status");
          clientLogger.error("PuckEditorClient", "Publish update failed", err);
        }
      });
    } else {
      // For items without publish state, just toggle the local state
      setIsPublished(!isPublished);
    }
  };

  const applySettings = () => {
    // For existing items, don't change the slug
    const newSlug = isExistingItem ? settings.slug : generateSlug(settings.title);
    if (!isExistingItem) {
      setSettings(prev => ({ ...prev, slug: newSlug }));
    }
    
    // Update the data with new settings
    setData(prev => ({
      ...prev,
      root: {
        ...prev.root,
        props: {
          ...prev.root.props,
          title: settings.title,
          slug: newSlug,
          haInstanceId: settings.haInstanceId,
          sidebarId: settings.sidebarId,
        }
      }
    }));
    setIsSettingsOpen(false);
  };

  const getHeaderTitle = () => {
    return `${type} Editor - ${data.root.props?.title || settings.title}`;
  };

  const getHeaderPath = () => {
    return data.root.title || settings.slug;
  };

  return (
    <div className="h-screen">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <Puck
        config={PuckConfig}
        data={data}
        onPublish={saveItem}
        onChange={setData}
        headerTitle={getHeaderTitle()}
        // @ts-ignore TODO: fix this type
        headerPath={getHeaderPath()}
        overrides={{
          headerActions: () => {
            const rightLabel = !currentItemId
              ? "Create"
              : !isPublished
                ? "Publish"
                : isDirty
                  ? "Update"
                  : "Unpublish";
            const rightHandler = !currentItemId
              ? saveItem
              : !isPublished
                ? publish
                : isDirty
                  ? updateItem
                  : updatePublished;

            return (
              <div className="flex gap-2">
                {viewUrlTemplate && initialSlug && (
                  <Link
                    href={viewUrlTemplate.replace('{slug}', initialSlug)}
                    size="sm"
                    color="secondary"
                    target="_blank"
                  >
                    View {type}
                  </Link>
                )}
                <Button
                  size="sm"
                  variant="bordered"
                  color="secondary"
                  onPress={() => router.push(backUrl)}
                >
                  Back to {type}s
                </Button>
                <Button
                  size="sm"
                  variant="bordered"
                  color="secondary"
                  onPress={() => setIsSettingsOpen(true)}
                >
                  Settings
                </Button>
                <Button
                  size="sm"
                  color="primary"
                  onPress={rightHandler}
                  isLoading={isPublishPending}
                  isDisabled={currentItemId ? (!isDirty && !isPublished) : false}
                >
                  {rightLabel}
                </Button>
              </div>
            );
          },
        }}
      />

      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        size="md"
      >
        <ModalContent>
          <ModalHeader>
            {type} Settings
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Name"
                placeholder={`Enter ${type} name`}
                value={settings.title}
                onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
              />
              <Input
                label="Slug"
                placeholder={`${type}-slug`}
                value={settings.slug}
                onChange={(e) => setSettings(prev => ({ ...prev, slug: e.target.value }))}
                description={isExistingItem ? "Slug cannot be changed for existing items" : "URL-friendly version of the name"}
                isDisabled={isExistingItem}
              />
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Home Assistant Instance
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={settings.haInstanceId || ""}
                    onChange={(e) => setSettings(prev => ({ ...prev, haInstanceId: e.target.value }))}
                  >
                    {haInstances.map((instance) => (
                      <option key={instance.id} value={instance.id}>
                        {instance.name} ({instance.hass_url})
                      </option>
                    ))}
                  </select>
                </div>
              {type === "page" && sidebars.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sidebar (Optional)
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={settings.sidebarId || ""}
                    onChange={(e) => setSettings(prev => ({ ...prev, sidebarId: e.target.value || null }))}
                  >
                    <option value="">No sidebar</option>
                    {sidebars.map((sidebar) => (
                      <option key={sidebar.id} value={sidebar.id}>
                        {sidebar.name} ({sidebar.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => setIsSettingsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={applySettings}
            >
              Apply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
