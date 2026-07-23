"use client";

import type { CSSProperties } from "react";
import { Puck, Data } from "@measured/puck";
import { PuckConfig } from "./puck.config";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Link,
  Textarea,
} from "@heroui/react";
import "@measured/puck/puck.css";
import "./puck-editor-theme.css";
import { useRouter } from "next/navigation";
import { countPuckDataWidgets } from "@repo/lib/puck/countPuckDataWidgets";
import {
  clientLogger,
  mergeThemeLayers,
  resolvedTokensToCssVars,
} from "@repo/lib";
import type { ThemeTokens } from "@repo/types/theme";
import { ThemeScope } from "../ThemeScope/ThemeScope";

type ThemePickerOption = { id: string; name: string };
type ThemeLibraryEntry = { id: string; tokens: ThemeTokens };

type PuckEditorClientProps = {
  type: "page" | "sidebar";
  initialData?: Data;
  itemId?: string | null;
  initialPublished?: boolean;
  sidebars?: { id: string; name: string; slug: string }[];
  initialSlug?: string;
  maxItemsPerDashboard?: number;
  themePickerThemes?: ThemePickerOption[];
  themeLibrary?: ThemeLibraryEntry[];
  initialThemeId?: string | null;
  initialThemeOverrides?: ThemeTokens | null;
  onCreateItem: (data: {
    name: string;
    slug: string;
    puck_data: Data;
    [key: string]: unknown;
  }) => Promise<{ id: string; slug: string }>;
  onUpdateItem: (
    slug: string,
    data: { name?: string; puck_data?: Data; [key: string]: unknown }
  ) => Promise<unknown>;
  onPublishItem?: (slug: string, published: boolean) => Promise<unknown>;
  editUrlTemplate: string;
  viewUrlTemplate?: string;
  backUrl: string;
};

function parseThemeOverridesJson(json: string): ThemeTokens | null {
  const raw = json.trim();
  if (!raw) return null;
  const parsed = JSON.parse(raw) as unknown;
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    Array.isArray(parsed)
  ) {
    throw new Error("Theme overrides must be a JSON object");
  }
  if (Object.keys(parsed).length === 0) return null;
  return parsed as ThemeTokens;
}

export default function PuckEditorClient({
  type,
  initialData,
  itemId,
  initialPublished = false,
  sidebars = [],
  initialSlug,
  maxItemsPerDashboard = -1,
  themePickerThemes = [],
  themeLibrary = [],
  initialThemeId = null,
  initialThemeOverrides = null,
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
  const [isApplyingSettings, setIsApplyingSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<{
    title: string;
    slug: string;
    sidebarId?: string | null;
    themeId: string | null;
    themeOverridesJson: string;
  }>(() => {
    const props = (initialData?.root?.props as Record<string, unknown>) || {};
    return {
      title:
        (props.title as string) ||
        `New ${type === "page" ? "Page" : "Sidebar"}`,
      slug: initialSlug || (props.slug as string) || `new-${type}`,
      sidebarId: (props.sidebarId as string | null) || null,
      themeId: initialThemeId ?? null,
      themeOverridesJson: JSON.stringify(initialThemeOverrides ?? {}, null, 2),
    };
  });

  const isExistingItem = !!currentItemId;
  const router = useRouter();

  const editorThemeStyle = useMemo((): CSSProperties => {
    const layerFromLibrary = settings.themeId
      ? themeLibrary.find((t) => t.id === settings.themeId)?.tokens ?? {}
      : {};
    let overrides: ThemeTokens = {};
    if (type === "page") {
      try {
        const parsed = parseThemeOverridesJson(settings.themeOverridesJson);
        if (parsed) overrides = parsed;
      } catch {
        // Invalid JSON while typing — preview uses library / defaults only
      }
    }
    const resolved = mergeThemeLayers(layerFromLibrary, overrides);
    return resolvedTokensToCssVars(resolved);
  }, [
    settings.themeId,
    settings.themeOverridesJson,
    themeLibrary,
    type,
  ]);

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

  const itemCount = useMemo(() => countPuckDataWidgets(data), [data]);
  const isAtLimit =
    maxItemsPerDashboard !== -1 && itemCount >= maxItemsPerDashboard;
  const isNearLimit =
    maxItemsPerDashboard !== -1 &&
    !isAtLimit &&
    itemCount >= Math.max(0, maxItemsPerDashboard - 3);

  const getItemLimitError = (): string | null => {
    if (maxItemsPerDashboard !== -1 && itemCount > maxItemsPerDashboard) {
      return `This dashboard has ${itemCount} items but your plan allows a maximum of ${maxItemsPerDashboard}. Please remove some items before saving.`;
    }
    return null;
  };

  const buildThemePayload = (): {
    theme_id: string | null;
    theme_overrides?: ThemeTokens | null;
  } => {
    if (type === "page") {
      const theme_overrides = parseThemeOverridesJson(
        settings.themeOverridesJson
      );
      return {
        theme_id: settings.themeId || null,
        theme_overrides,
      };
    }
    return { theme_id: settings.themeId || null };
  };

  const saveItem = async () => {
    setError(null);
    const limitError = getItemLimitError();
    if (limitError) {
      setError(limitError);
      return;
    }
    try {
      let themePayload: ReturnType<typeof buildThemePayload>;
      try {
        themePayload = buildThemePayload();
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Invalid theme overrides JSON"
        );
        return;
      }
      const createData = {
        name: settings.title,
        slug: settings.slug,
        puck_data: data,
        ...(sidebars.length > 0 && { sidebar_id: settings.sidebarId }),
        ...themePayload,
      };

      const result = await onCreateItem(createData);
      setCurrentItemId(result.id);
      setLastSavedJson(JSON.stringify(data));
      clientLogger.info(
        "PuckEditorClient",
        `${type} created successfully`,
        result
      );
      router.push(editUrlTemplate.replace("{slug}", result.slug));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save";
      setError(errorMessage);
      clientLogger.error("PuckEditorClient", "Save failed", err);
    }
  };

  const updateItem = async () => {
    setError(null);
    const limitError = getItemLimitError();
    if (limitError) {
      setError(limitError);
      return;
    }
    try {
      let themePayload: ReturnType<typeof buildThemePayload>;
      try {
        themePayload = buildThemePayload();
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Invalid theme overrides JSON"
        );
        return;
      }
      const updateData = {
        name: settings.title,
        puck_data: data,
        ...(sidebars.length > 0 && { sidebar_id: settings.sidebarId }),
        ...themePayload,
      };

      const slugToUse = initialSlug || settings.slug;
      await onUpdateItem(slugToUse, updateData);
      setLastSavedJson(JSON.stringify(data));
      clientLogger.info("PuckEditorClient", `${type} updated successfully`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update";
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
          setError(
            err instanceof Error ? err.message : "Failed to update status"
          );
          clientLogger.error("PuckEditorClient", "Publish update failed", err);
        }
      });
    } else {
      setIsPublished(!isPublished);
    }
  };

  const applySettings = async () => {
    setError(null);
    const newSlug = generateSlug(settings.title);

    if (currentItemId) {
      setIsApplyingSettings(true);
      try {
        const themePayload = buildThemePayload();
        const slugToUse = initialSlug || settings.slug;
        const patch: Record<string, unknown> = {
          name: settings.title,
          ...themePayload,
        };
        if (type === "page" && sidebars.length > 0) {
          patch.sidebar_id = settings.sidebarId;
        }
        await onUpdateItem(slugToUse, patch);
        router.refresh();
        clientLogger.info("PuckEditorClient", "Settings (incl. theme) saved");
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "Failed to save settings to server";
        setError(msg);
        clientLogger.error("PuckEditorClient", "applySettings save failed", e);
        return;
      } finally {
        setIsApplyingSettings(false);
      }
    }

    setSettings((prev) => ({ ...prev, slug: newSlug }));

    setData((prev) => ({
      ...prev,
      root: {
        ...prev.root,
        props: {
          ...prev.root.props,
          title: settings.title,
          slug: newSlug,
          sidebarId: settings.sidebarId,
        },
      },
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
    <div className="h-screen flex flex-col">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-4 shrink-0">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <ThemeScope
        className="flex-1 min-h-0 flex flex-col bg-theme-page-background text-theme-text"
        style={editorThemeStyle}
      >
        <Puck
          config={PuckConfig}
          data={data}
          onPublish={saveItem}
          onChange={setData}
          headerTitle={getHeaderTitle()}
          headerPath={getHeaderPath()}
          iframe={{ enabled: false }}
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
              <div className="flex items-center gap-2">
                {maxItemsPerDashboard !== -1 && (
                  <Chip
                    size="sm"
                    color={
                      isAtLimit
                        ? "danger"
                        : isNearLimit
                          ? "warning"
                          : "default"
                    }
                    variant="flat"
                  >
                    {itemCount}/{maxItemsPerDashboard} items
                  </Chip>
                )}
                {viewUrlTemplate && initialSlug && (
                  <Link
                    href={viewUrlTemplate.replace("{slug}", initialSlug)}
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
                  isDisabled={currentItemId ? !isDirty && !isPublished : false}
                >
                  {rightLabel}
                </Button>
              </div>
            );
          },
        }}
        />
      </ThemeScope>

      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>{type} Settings</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Name"
                placeholder={`Enter ${type} name`}
                value={settings.title}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, title: e.target.value }))
                }
              />
              <Input
                label="Slug"
                placeholder={`${type}-slug`}
                value={settings.slug}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, slug: e.target.value }))
                }
                description="URL-friendly version of the name"
                isDisabled={isExistingItem}
              />
              {type === "page" && sidebars.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sidebar (Optional)
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={settings.sidebarId || ""}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        sidebarId: e.target.value || null,
                      }))
                    }
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
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <label className="block text-sm font-medium">Theme</label>
                  <Link href="/setup/themes" size="sm">
                    Manage themes
                  </Link>
                </div>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={settings.themeId || ""}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      themeId: e.target.value || null,
                    }))
                  }
                >
                  <option value="">Default (built-in dark)</option>
                  {themePickerThemes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {type === "sidebar"
                    ? "Optional. Leave default to use the page theme when this sidebar is shown with a page."
                    : "Optional library theme for this page."}
                </p>
              </div>
              {type === "page" && (
                <Textarea
                  label="Per-page color overrides (JSON)"
                  placeholder='{ "primary": "#7c3aed", "entity-on": "#22c55e" }'
                  value={settings.themeOverridesJson}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      themeOverridesJson: e.target.value,
                    }))
                  }
                  minRows={4}
                  description="Optional. Keys match theme token names (without --theme-). Invalid JSON will block save."
                />
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsSettingsOpen(false)}>
              Cancel
            </Button>
            <Button
              color="primary"
              isLoading={isApplyingSettings}
              onPress={() => {
                void applySettings();
              }}
            >
              Apply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
