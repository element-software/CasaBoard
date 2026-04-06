"use client";
import { useState, useTransition, useEffect } from "react";
import { PageStorage, HAInstanceStorage } from "@repo/lib";
import { Page } from "@repo/types/page";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiPlus, mdiWeb } from "@mdi/js";
import { Button, Chip, cn } from "@heroui/react";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";
import { PageCard } from "./PageCard";
import { useRouter } from "next/navigation";

interface PagesManagementProps {
  showAllPages?: boolean;
  compact?: boolean;
}

export const PagesManagement = ({
  showAllPages = false,
  compact = false,
}: PagesManagementProps) => {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [hasHAInstances, setHasHAInstances] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [loadedPages, instances] = await Promise.all([
          PageStorage.getAllPages(),
          HAInstanceStorage.listHAInstances(),
        ]);
        setPages(loadedPages);
        setHasHAInstances(instances.length > 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load pages");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const canCreateDashboard = () => hasHAInstances;

  const handleCreatePage = () => {
    if (!hasHAInstances) {
      router.push("/setup/ha-config");
    } else {
      window.location.href = "/setup/pages/create";
    }
  };

  const handleDeletePage = async (slug: string, pageName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${pageName}"? This action cannot be undone.`
      )
    )
      return;

    startTransition(async () => {
      try {
        await PageStorage.deletePage(slug);
        setPages(pages.filter((page) => page.slug !== slug));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete page");
      }
    });
  };

  const handleTogglePublished = async (
    slug: string,
    currentPublished: boolean
  ) => {
    startTransition(async () => {
      try {
        await PageStorage.updatePage(slug, { published: !currentPublished });
        setPages(
          pages.map((page) =>
            page.slug === slug
              ? { ...page, published: !currentPublished }
              : page
          )
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update page status"
        );
      }
    });
  };

  const displayPages = showAllPages ? pages : pages.slice(0, 6);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-theme-text-secondary text-sm">Loading pages...</div>
      </div>
    );
  }

  if (error) return <ErrorState error={error} />;
  if (pages.length === 0)
    return (
      <EmptyState
        canCreate={canCreateDashboard()}
        onCreate={handleCreatePage}
      />
    );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={cn(
              "font-semibold text-theme-text",
              compact ? "text-lg" : "text-xl"
            )}
          >
            Dashboard Pages
          </h2>
          {!compact && (
            <p className="text-sm text-theme-text-secondary">
              {pages.length} page{pages.length !== 1 ? "s" : ""} total
            </p>
          )}
        </div>
        {!showAllPages && (
          <Button
            color="primary"
            size="sm"
            startContent={<Icon path={mdiPlus} className="w-4 h-4" />}
            isDisabled={!canCreateDashboard()}
            onPress={handleCreatePage}
          >
            {compact ? "New" : "New Page"}
          </Button>
        )}
      </div>

      {/* Pages List */}
      <div
        className={cn(
          compact ? "space-y-2" : "grid grid-cols-1 sm:grid-cols-2 gap-3"
        )}
      >
        {displayPages.map((page) => (
          <PageCard
            key={page.id}
            page={page}
            compact={compact}
            onTogglePublished={handleTogglePublished}
            onDelete={handleDeletePage}
            isPending={isPending}
          />
        ))}
      </div>

      {/* Footer Info */}
      {!showAllPages && pages.length > displayPages.length && (
        <div className={cn("text-center", compact ? "py-2" : "py-3")}>
          <p
            className={cn(
              "text-theme-text-secondary",
              compact ? "text-xs" : "text-sm"
            )}
          >
            And {pages.length - displayPages.length} more pages
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {!showAllPages && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            as={Link}
            href="/setup/pages"
            variant="bordered"
            className="flex-1"
            startContent={<Icon path={mdiWeb} className="w-4 h-4" />}
          >
            Manage All Pages
          </Button>
        </div>
      )}
    </div>
  );
};
