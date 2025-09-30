"use client";
import { useState, useTransition } from "react";
import { PageService } from "@repo/lib";
import { Page } from "@repo/types/page";
import { Entitlements } from "@repo/types/subscription";
import Link from "next/link";
import Icon from "@mdi/react";
import {
  mdiPlus,
  mdiPencil,
  mdiTrashCan,
  mdiEye,
  mdiWeb,
  mdiPublish,
  mdiEyeOff,
  mdiCheckCircle,
  mdiAlertCircle,
  mdiClock,
  mdiHomeAssistant,
  mdiDotsVertical,
} from "@mdi/js";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Skeleton,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  cn,
} from "@heroui/react";
import { useRouter } from "next/navigation";

interface PagesManagementProps {
  showAllPages?: boolean;
  initialPages?: Page[];
  initialError?: string | null;
  compact?: boolean;
  entitlements: Entitlements;
}

export const PagesManagement = ({
  showAllPages = false,
  initialPages = [],
  initialError = null,
  compact = false,
  entitlements,
}: PagesManagementProps) => {
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Helper functions for entitlements
  const canCreateDashboard = (currentCount: number) => {
    if (!entitlements?.active) return false;
    return entitlements.maxDashboards === -1 || currentCount < entitlements.maxDashboards;
  };

  const getRemainingDashboards = (currentCount: number) => {
    if (!entitlements?.active) return 0;
    if (entitlements.maxDashboards === -1) return Infinity;
    return Math.max(0, entitlements.maxDashboards - currentCount);
  };

  const handleDeletePage = async (slug: string, pageName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${pageName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    startTransition(async () => {
      try {
        await PageService.deletePage(slug);
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
        await PageService.updatePage(slug, { published: !currentPublished });
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Determine how many pages to show based on entitlements
  const maxDisplayPages =
    entitlements?.maxDashboards === -1
      ? pages.length
      : entitlements?.maxDashboards || 3;
  const displayPages = showAllPages ? pages : pages.slice(0, maxDisplayPages);

  if (loading) {
    return (
      <Card className="w-full">
        <CardBody className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <Spinner size="sm" />
            <span className="text-theme-text-secondary">Loading pages...</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardBody className="text-center py-6">
          <div className="w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
            <Icon path={mdiAlertCircle} className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Pages
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            color="primary"
            variant="flat"
            onPress={() => window.location.reload()}
          >
            Retry
          </Button>
        </CardBody>
      </Card>
    );
  }

  if (pages.length === 0) {
    return (
      <Card className="w-full">
        <CardBody className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-theme-primary/10 to-theme-accent/10 rounded-3xl flex items-center justify-center">
            <Icon path={mdiWeb} className="w-10 h-10 text-theme-primary" />
          </div>
          <h3 className="text-xl font-semibold text-theme-text mb-3">
            No pages yet
          </h3>
          <p className="text-theme-text-secondary mb-6 max-w-sm mx-auto">
            Get started by creating your first dashboard page to organize your
            Home Assistant controls.
          </p>
          <Button
            as={Link}
            href="/setup/pages/create"
            color="primary"
            size="lg"
            startContent={<Icon path={mdiPlus} className="w-5 h-5" />}
            isDisabled={!canCreateDashboard(pages.length)}
          >
            Create First Page
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={cn("font-semibold text-theme-text", {
              "text-lg": compact,
              "text-xl": !compact,
            })}
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
            as={Link}
            href="/setup/pages/create"
            color="primary"
            size={compact ? "sm" : "sm"}
            startContent={<Icon path={mdiPlus} className="w-4 h-4" />}
            isDisabled={!canCreateDashboard(pages.length)}
          >
            {compact ? "New" : "New Page"}
          </Button>
        )}
      </div>

      {/* Pages List */}
      <div
        className={cn(
          compact ? "space-y-2" : "grid grid-cols-1 sm:grid-cols-2 space-y-3"
        )}
      >
        {displayPages.map((page) => (
          <Card key={page.id} className="hover:shadow-md transition-shadow">
            <CardBody className={cn(compact ? "p-3" : "p-4")}>
              <div
                className={cn(
                  "flex justify-between",
                  compact ? "items-center gap-3" : "items-start gap-4"
                )}
              >
                {/* Page Info */}
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      !compact && "mb-2"
                    )}
                  >
                    <h3
                      className={cn(
                        "text-theme-text truncate",
                        compact ? "font-medium text-sm" : "font-semibold"
                      )}
                    >
                      {page.name}
                    </h3>
                    <Chip
                      size="sm"
                      color={page.published ? "success" : "warning"}
                      variant="flat"
                      className={compact ? "text-xs" : ""}
                      startContent={
                        !compact && (
                          <Icon
                            path={
                              page.published ? mdiCheckCircle : mdiAlertCircle
                            }
                            className="w-3 h-3"
                          />
                        )
                      }
                    >
                      {page.published
                        ? compact
                          ? "Live"
                          : "Published"
                        : "Draft"}
                    </Chip>
                  </div>

                  {/* Metadata */}
                  {compact ? (
                    <div className="flex items-center gap-3 mt-1 text-xs text-theme-text-secondary">
                      <span className="font-mono">/{page.slug}</span>
                      <span>•</span>
                      <span>{formatDate(page.updated_at)}</span>
                    </div>
                  ) : (
                    <div className="space-y-1 text-sm text-theme-text-secondary">
                      <div className="flex items-center gap-2">
                        <Icon path={mdiWeb} className="w-4 h-4 flex-shrink-0" />
                        <span className="font-mono text-xs">/{page.slug}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon
                          path={mdiClock}
                          className="w-4 h-4 flex-shrink-0"
                        />
                        <span className="text-xs">
                          Updated {formatDate(page.updated_at)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon
                          path={mdiHomeAssistant}
                          className="w-4 h-4 flex-shrink-0"
                        />
                        <span className="text-xs">{page.ha_instance_id}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    as={Link}
                    href={`/dashboard/${page.slug}`}
                    isIconOnly
                    size="sm"
                    variant="light"
                    title="View page"
                  >
                    <Icon path={mdiEye} className="w-4 h-4" />
                  </Button>

                  <Button
                    as={Link}
                    href={`/setup/pages/edit/${page.slug}`}
                    isIconOnly
                    size="sm"
                    variant="light"
                    title="Edit page"
                  >
                    <Icon path={mdiPencil} className="w-4 h-4" />
                  </Button>

                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        title="More actions"
                      >
                        <Icon path={mdiDotsVertical} className="w-4 h-4" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Page actions">
                      <DropdownItem
                        key="toggle-publish"
                        startContent={
                          <Icon
                            path={page.published ? mdiEyeOff : mdiPublish}
                            className="w-4 h-4"
                          />
                        }
                        onPress={() =>
                          handleTogglePublished(page.slug, page.published)
                        }
                      >
                        {page.published ? "Unpublish" : "Publish"}
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        startContent={
                          <Icon path={mdiTrashCan} className="w-4 h-4" />
                        }
                        onPress={() => handleDeletePage(page.slug, page.name)}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </CardBody>
          </Card>
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
      {entitlements && entitlements.maxDashboards !== -1 && (
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
              {getRemainingDashboards(pages.length) === 0 && " • Limit reached"}
              {getRemainingDashboards(pages.length) > 0 &&
                getRemainingDashboards(pages.length) <= 2 &&
                ` • ${getRemainingDashboards(pages.length)} remaining`}
            </span>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-text-secondary">
                Pages used: {pages.length} / {entitlements.maxDashboards}
              </span>
              {getRemainingDashboards(pages.length) === 0 && (
                <Chip size="sm" color="warning" variant="flat">
                  Limit reached
                </Chip>
              )}
              {getRemainingDashboards(pages.length) > 0 &&
                getRemainingDashboards(pages.length) <= 2 && (
                  <Chip size="sm" color="warning" variant="flat">
                    {getRemainingDashboards(pages.length)} remaining
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
