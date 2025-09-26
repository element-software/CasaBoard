"use client";
import { Chip, Button, cn, Skeleton } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiCheckCircle } from "@mdi/js";
import { useState } from "react";
import { useHA } from "@repo/ha";

export interface HAInstance {
  id: string;
  name: string;
  hass_url: string;
  hass_token: string;
  created_at: string;
  is_active: boolean;
}
export interface HAInstanceProps {
  instance: HAInstance;
  compact?: boolean;
  onSetActive: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HAInstance = ({
  instance,
  compact,
  onSetActive,
  onDelete,
}: HAInstanceProps) => {
  const { id, name, hass_url, is_active } = instance;
  const [isSetActivePending, startSetActive] = useState(false);
  const [isDeletePending, startDelete] = useState(false);
  const { connected, entities } = useHA();
  const entityCount = Object.keys(entities ?? {}).length;

  const handleSetActive = () => {
    startSetActive(true);
    onSetActive(id);
    startSetActive(false);
  };

  const handleDelete = () => {
    startDelete(true);
    onDelete(id);
    startDelete(false);
  };

  return (
    <Skeleton className="rounded-sm" isLoaded={connected}>
      <div
        key={id}
        className={cn(
          "flex items-center justify-between gap-3 p-3 bg-red-500 rounded",
          {
            "bg-green-900": is_active,
            "bg-red-900": !is_active,
          }
        )}
      >
        <div className="min-w-0">
          <div className="font-medium truncate">{name}</div>
          <div className="flex items-center gap-2 text-sm text-foreground-500 truncate">
            <span className="truncate">{hass_url}</span>
            {is_active && (
              <Chip
                size="sm"
                color="default"
                variant="flat"
                startContent={
                  <Icon path={mdiCheckCircle} className="w-3 h-3" />
                }
              >
                Active
              </Chip>
            )}
            <Chip
              size="sm"
              color="default"
              variant="flat"
              startContent={<Icon path={mdiCheckCircle} className="w-3 h-3" />}
            >
              {entityCount} entities
            </Chip>
          </div>
        </div>

        {!compact && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="flat"
              onPress={handleSetActive}
              isLoading={isSetActivePending}
              isDisabled={is_active}
            >
              Set active
            </Button>
            <Button
              size="sm"
              color="danger"
              onPress={handleDelete}
              isLoading={isDeletePending}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </Skeleton>
  );
};
