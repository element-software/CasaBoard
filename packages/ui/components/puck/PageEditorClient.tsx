"use client";

import { Puck, Data } from "@measured/puck";
import { PuckConfig } from "./puck.config";
import { useEffect, useState, useTransition } from "react";
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
import { PageActions } from "@repo/lib";

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
  const [currentPageId, setCurrentPageId] = useState<string | null>(
    pageId || null
  );
  const [isPublished, setIsPublished] = useState<boolean>(initialPublished);
  const [isPending, startTransition] = useTransition();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<{
    title: string;
    slug: string;
    haInstanceId?: string | null;
  }>(() => {
    const props = (initialData?.root?.props as any) || {};
    return {
      title: props.title || "New Page",
      slug: props.slug || "new-page",
      haInstanceId: props.haInstanceId || null,
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

  const savePage = async () => {
    setError(null);
    startTransition(async () => {
      try {
        const pageData = {
          name: (data.root.props as any).title,
          slug: (data.root.props as any).slug,
          puck_data: data,
          published: isPublished, // Use current published state
          ha_instance_id: (data.root.props as any).haInstanceId || null,
        };

        console.log("savePage:: pageData", pageData);

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

        console.log(
          `Page saved as ${isPublished ? "published" : "draft"} successfully`
        );
      } catch (error) {
        console.error("Error saving page:", error);
        setError(
          error instanceof Error ? error.message : "Failed to save page"
        );
      }
    });
  };

  const publishPage = async () => {
    setError(null);
    startTransition(async () => {
      try {
        // Toggle published state
        const newPublishedState = !isPublished;

        const pageData = {
          name: (data.root.props as any).title,
          slug:
            (data.root.props as any).slug ||
            generateSlug((data.root.props as any).title),
          puck_data: data,
          published: newPublishedState,
          ha_instance_id: (data.root.props as any).haInstanceId || null,
        };

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

        setIsPublished(newPublishedState);
        console.log(
          `Page ${newPublishedState ? "published" : "unpublished"} successfully`
        );
      } catch (error) {
        console.error("Error updating page:", error);
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
          haInstanceId: settings.haInstanceId || null,
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
          headerActions: () => (
            <div className="flex gap-2">
              <Button
                variant="flat"
                color="secondary"
                onPress={() => router.push("/setup/pages")}
              >
                Back to Pages
              </Button>
              <Button variant="bordered" color="primary" onPress={openSettings}>
                Page Settings
              </Button>
              <Button
                color="secondary"
                variant="bordered"
                onPress={savePage}
                isLoading={isPending}
                isDisabled={isPending}
              >
                {isPublished ? "Save Published" : "Save Draft"}
              </Button>
              <Button
                color="primary"
                onPress={publishPage}
                isLoading={isPending}
                isDisabled={isPending}
              >
                {isPublished ? "Unpublish" : "Publish"}
              </Button>
            </div>
          ),
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
                          haInstanceId: e.target.value || null,
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
                          : "This page is a draft and not visible to users"}
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
