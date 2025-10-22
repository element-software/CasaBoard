"use client";
import { useState, useTransition, useEffect } from "react";
import { PageActions } from "@repo/lib";
import { Page } from "@repo/types/page";
import { Entitlements } from "@repo/types/subscription";
import { HAInstance } from "@repo/types/ha";
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
  initialPages?: Page[];
  initialError?: string | null;
  compact?: boolean;
  entitlements: Entitlements;
  haInstances?: HAInstance[];
}

export const PagesManagement = ({
  showAllPages = false,
  initialPages = [],
  initialError = null,
  compact = false,
  entitlements,
  haInstances = [],
}: PagesManagementProps) => {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [error, setError] = useState<string | null>(initialError);
  const [isPending, startTransition] = useTransition();

  // Helper functions
  const canCreateDashboard = (currentCount: number) =>
    entitlements?.active &&
    (entitlements.maxDashboards === -1 ||
      currentCount < entitlements.maxDashboards) && haInstances.length > 0;

  const getRemainingDashboards = (currentCount: number) => {
    if (!entitlements?.active || entitlements.maxDashboards === -1)
      return Infinity;
    return Math.max(0, entitlements.maxDashboards - currentCount);
  };

  const handleCreatePage = () => {
    if (haInstances.length === 0) {
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

  const maxDisplayPages =
    entitlements?.maxDashboards === -1
      ? pages.length
      : entitlements?.maxDashboards || 3;
  const displayPages = showAllPages ? pages : pages.slice(0, maxDisplayPages);

  // Early returns for error and empty states
  if (error) return <ErrorState error={error} />;
  if (pages.length === 0)
    return (
      <EmptyState
        canCreate={canCreateDashboard(0)}
        onCreate={handleCreatePage}
      />
    );

  const remaining = getRemainingDashboards(pages.length);

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
            isDisabled={!canCreateDashboard(pages.length)}
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

      {/* Usage Info */}
      {entitlements?.maxDashboards !== -1 && (
        <div
          className={cn(
            compact
              ? "text-center"
              : "bg-theme-background-secondary rounded-lg p-4"
          )}
        >
          {compact ? (
            <span className="text-xs text-theme-text-secondary">
              {pages.length}/{entitlements.maxDashboards} pages
              {remaining === 0 && " • Limit reached"}
              {remaining > 0 && remaining <= 2 && ` • ${remaining} remaining`}
            </span>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-text-secondary">
                Pages used: {pages.length} / {entitlements.maxDashboards}
              </span>
              {remaining === 0 && (
                <Chip size="sm" color="warning" variant="flat">
                  Limit reached
                </Chip>
              )}
              {remaining > 0 && remaining <= 2 && (
                <Chip size="sm" color="warning" variant="flat">
                  {remaining} remaining
                </Chip>
              )}
            </div>
          )}
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
