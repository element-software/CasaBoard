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
  Switch,
} from "@heroui/react";
import "@measured/puck/puck.css";
import { useRouter } from "next/navigation";
import { LinkService, PageActions, clientLogger } from "@repo/lib";

type PageEditorClientProps = {
  initialData?: Data;
  pageId?: string | null;
  userId?: string | null;
  initialPublished?: boolean;
  haInstances?: { id: string; name: string; hass_url: string }[];
};

export default function PageEditorClient({
  initialData,
  pageId,
  userId,
  initialPublished = false,
  haInstances = [],
}: PageEditorClientProps) {
  const [data, setData] = useState<Data>(
    initialData || { content: [], root: { props: {} } }
  );
  const [lastSavedJson, setLastSavedJson] = useState<string>(
    JSON.stringify(initialData || { content: [], root: { props: {} } })
  );
  const [currentPageId, setCurrentPageId] = useState<string | null>(
    pageId || null
  );
  const [isPublished, setIsPublished] = useState<boolean>(initialPublished);
  const [isPublishPending, startPublishTransition] = useTransition();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<{
    title: string;
    slug: string;
    haInstanceId?: string | null | undefined;
  }>(() => {
    const props = (initialData?.root?.props as any) || {};
    return {
      title: props.title || "New Page",
      slug: props.slug || "new-page",
      haInstanceId: props.haInstanceId || haInstances[0].id || undefined,
    };
  });
  const router = useRouter();

  // Open settings immediately on create (no currentPageId) so user can enter a page name
  useEffect(() => {
    if (!currentPageId) {
      setIsSettingsOpen(true);
    }
  }, [currentPageId]);

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

  const savePage = async () => {
    setError(null);
    startPublishTransition(async () => {
      try {
        await saveAs(isPublished);
      } catch (error) {
        clientLogger.error('PageEditorClient', 'Error saving page', error);
        setError(
          error instanceof Error ? error.message : "Failed to save page"
        );
      }
    });
  };

  const buildPagePayload = (published: boolean) => {
    return {
      name: (data.root.props as any).title,
      slug:
        (data.root.props as any).slug ||
        generateSlug((data.root.props as any).title),
      puck_data: data,
      published,
      ha_instance_id: (data.root.props as any).haInstanceId || haInstances[0].id || null,
    } as any;
  };

  const saveAs = async (published: boolean) => {
    const pageData = buildPagePayload(published);
    const isEdit = Boolean(currentPageId);
    let saved;

    if (isEdit) {
      saved = await PageActions.updatePage(
        (data.root.props as any).slug,
        pageData
      );
    } else {
      saved = await PageActions.createPage(pageData);
      if (saved?.id) {
        setCurrentPageId(saved.id as string);
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("id", saved.id);
        window.history.replaceState({}, "", newUrl.toString());
      }
    }

    setIsPublished(published);
    setLastSavedJson(JSON.stringify(data));
    return saved;
  };

  const publish = async () => {
    setError(null);
    startPublishTransition(async () => {
      try {
        await saveAs(true);
      } catch (error) {
        clientLogger.error('PageEditorClient', 'Error publishing page', error);
        setError(
          error instanceof Error ? error.message : "Failed to publish page"
        );
      }
    });
  };

  const updatePublished = async () => {
    setError(null);
    startPublishTransition(async () => {
      try {
        await saveAs(true);
      } catch (error) {
        clientLogger.error('PageEditorClient', 'Error updating page', error);
        setError(
          error instanceof Error ? error.message : "Failed to update page"
        );
      }
    });
  };

  const openSettings = () => {
    const props = (data.root.props as any) || {};
    setSettings({
      title: props.title || "New Page",
      slug: props.slug || "new-page",
      haInstanceId: props.haInstanceId || haInstances[0].id || undefined,
    });
    setIsSettingsOpen(true);
  };

  const applySettings = () => {
    const nextSlug = settings.slug || generateSlug(settings.title);
    setData({
      ...data,
      root: {
        ...data.root,
        props: {
          ...(data.root.props as any),
          title: settings.title,
          slug: nextSlug,
          haInstanceId: settings.haInstanceId || haInstances[0].id || undefined,
        },
      },
    });
    setIsSettingsOpen(false);
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
        onPublish={savePage}
        onChange={setData}
        headerTitle={`Page Editor - ${data.root.props?.title}`}
        // @ts-ignore TODO: fix this type
        headerPath={data.root.props?.slug}
        overrides={{
          headerActions: () => {
            const rightLabel = !isPublished
              ? "Publish"
              : isDirty
                ? "Update"
                : "Unpublish";
            const rightHandler = !isPublished
              ? publish : updatePublished
            return (
              <div className="flex gap-2">
                                <Button
                  variant="flat"
                  color="secondary"
                  onPress={() => {
                    if (currentPageId && (data.root.props as any).slug) {
                      const viewUrl = LinkService.crossAppHrefClient("app", `/dashboard/${(data.root.props as any).slug}`);
                      router.push(viewUrl);
                    }
                  }}
                >
                  View Page
                </Button>
                <Button
                  variant="flat"
                  color="secondary"
                  onPress={() => router.push("/setup/pages")}
                >
                  Back to Pages
                </Button>
                <Button
                  variant="bordered"
                  color="primary"
                  onPress={openSettings}
                >
                  Page Settings
                </Button>
                <Button
                  color="primary"
                  onPress={rightHandler}
                  isLoading={isPublishPending}
                  isDisabled={isPublishPending}
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
        size="lg"
        className="max-h-[60vh]"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Page Settings</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Title"
                    autoFocus
                    value={settings.title}
                    onChange={(e) =>
                      setSettings({ ...settings, title: e.target.value })
                    }
                  />
                  <Input
                    label="Slug"
                    value={settings.slug}
                    onChange={(e) =>
                      setSettings({ ...settings, slug: e.target.value })
                    }
                  />

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Home Assistant Instance
                    </label>
                    <select
                      className="w-full border rounded-md px-3 py-2 text-foreground"
                      value={settings.haInstanceId || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          haInstanceId: e.target.value || undefined,
                        })
                      }
                    >
                      {haInstances.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name} ({i.hass_url})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Published</p>
                      <p className="text-sm text-gray-500">
                        {isPublished
                          ? "This page is published and visible to users"
                          : "This page is not published and not visible to users"}
                      </p>
                    </div>
                    <Switch
                      isSelected={isPublished}
                      onValueChange={setIsPublished}
                      color="primary"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={applySettings}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
