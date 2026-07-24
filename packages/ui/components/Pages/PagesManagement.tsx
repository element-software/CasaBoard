"use client";
import { useState, useTransition } from "react";
import { PageActions } from "@repo/lib";
import { Page } from "@repo/types/page";
import Link from "next/link";
import { useHAConnection } from "@repo/hooks";
import Icon from "@mdi/react";
import { mdiPlus, mdiWeb } from "@mdi/js";
import { Button, cn } from "@heroui/react";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";
import { PageCard } from "./PageCard";
import { useRouter } from "next/navigation";

interface PagesManagementProps {
  showAllPages?: boolean;
  showHeader?: boolean;
  initialPages?: Page[];
  initialError?: string | null;
  compact?: boolean;
  /** e.g. http://homeassistant.local:8123/local/casaboard — enables copy public URL */
  publicBaseUrl?: string;
}

export const PagesManagement = ({
  showAllPages = false,
  showHeader = true,
  initialPages = [],
  initialError = null,
  compact = false,
  publicBaseUrl = "",
}: PagesManagementProps) => {
  const { connection } = useHAConnection();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [error, setError] = useState<string | null>(initialError);
  const [isPending, startTransition] = useTransition();

  const canCreateDashboard = () => !!connection;

  const handleCreatePage = () => {
    if (!connection) {
      router.push("/onboarding");
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
        await PageActions.deletePage(slug);
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
        await PageActions.updatePage(slug, { published: !currentPublished });
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

  const maxDisplayPages = compact ? 3 : 6;
  const displayPages = showAllPages ? pages : pages.slice(0, Math.max(maxDisplayPages, pages.length));

  // Early returns for error and empty states
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
      {/* Header — same structure regardless of showHeader to keep React Aria IDs stable */}
      <div className={cn("flex items-center", showHeader ? "justify-between" : "justify-end")}>
        {showHeader && (
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
        )}
        <Button
          color="primary"
          size="sm"
          startContent={<Icon path={mdiPlus} className="w-4 h-4" />}
          isDisabled={!canCreateDashboard()}
          onPress={handleCreatePage}
        >
          {compact ? "New" : "New Page"}
        </Button>
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
            publicBaseUrl={publicBaseUrl}
          />
        ))}
      </div>

      {/* Footer Info */}
      {!showAllPages && pages.length > maxDisplayPages && (
        <div className={cn("text-center", compact ? "py-2" : "py-3")}>
          <p
            className={cn(
              "text-theme-text-secondary",
              compact ? "text-xs" : "text-sm"
            )}
          >
            And {pages.length - maxDisplayPages} more pages
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
