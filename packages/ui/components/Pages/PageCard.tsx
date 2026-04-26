import { Page } from "@repo/types/page";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  cn,
} from "@heroui/react";
import Icon from "@mdi/react";
import {
  mdiWeb,
  mdiClock,
  mdiHomeAssistant,
  mdiEye,
  mdiPencil,
  mdiDotsVertical,
  mdiCheckCircle,
  mdiAlertCircle,
  mdiTrashCan,
  mdiEyeOff,
  mdiEyeOutline,
} from "@mdi/js";
import Link from "next/link";
import { PlanLockCard } from "../Shared/util/PlanLockOverlay";

export const PageCard = ({
  page,
  compact,
  onTogglePublished,
  onDelete,
  isPending,
  locked = false,
}: {
  page: Page;
  compact: boolean;
  onTogglePublished: (slug: string, published: boolean) => void;
  onDelete: (slug: string, name: string) => void;
  isPending: boolean;
  locked?: boolean;
}) => {
  if (locked) {
    return (
      <PlanLockCard name={page.name} compact={compact} />
    );
  }
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardBody className={cn(compact ? "p-3" : "p-4")}>
        <div
          className={cn(
            "flex justify-between",
            compact ? "items-center gap-3" : "items-start gap-4"
          )}
        >
          <div className="flex-1 min-w-0">
            <div className={cn("flex items-center gap-2", !compact && "mb-2")}>
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
                      path={page.published ? mdiCheckCircle : mdiAlertCircle}
                      className="w-3 h-3"
                    />
                  )
                }
              >
                {page.published ? (compact ? "Live" : "Published") : "Draft"}
              </Chip>
            </div>

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
                  <Icon path={mdiClock} className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs">
                    Updated {formatDate(page.updated_at)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    path={mdiHomeAssistant}
                    className="w-4 h-4 flex-shrink-0"
                  />
                  <span className="text-xs">
                    {(page.puck_data?.root?.props as { haInstanceId?: string } | undefined)
                      ?.haInstanceId
                      ? "HA linked"
                      : "No HA instance in page settings"}
                  </span>
                </div>
              </div>
            )}
          </div>

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
                <DropdownItem key="toggle-publish" className="p-0">
                  <Button
                    color="primary"
                    variant="flat"
                    size="sm"
                    title="Toggle publish"
                    className="w-full"
                    startContent={
                      <Icon
                        path={page.published ? mdiEyeOff : mdiEyeOutline}
                        className="w-4 h-4"
                      />
                    }
                    onPress={() => onTogglePublished(page.slug, page.published)}
                  >
                    {page.published ? "Unpublish" : "Publish"}
                  </Button>
                </DropdownItem>
                <DropdownItem key="delete" className="p-0">
                  <Button
                    color="danger"
                    variant="flat"
                    size="sm"
                    title="Delete page"
                    className="w-full"
                    onPress={() => onDelete(page.slug, page.name)}
                    startContent={
                      <Icon path={mdiTrashCan} className="w-4 h-4" />
                    }
                    isLoading={isPending}
                  >
                    Delete
                  </Button>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
