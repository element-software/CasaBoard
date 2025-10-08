"use client";
import {
  Chip,
  Button,
  cn,
  Skeleton,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "@heroui/react";
import Icon from "@mdi/react";
import { mdiCheckCircle, mdiAlertCircle } from "@mdi/js";
import { useState } from "react";
import { useHA } from "@repo/ha";
import { HAInstance as HAInstanceType } from "@repo/types/ha";

export interface HAInstanceProps {
  instance: HAInstanceType;
  compact?: boolean;
  onDelete: (id: string) => void;
}

export const HAInstance = ({
  instance,
  compact,
  onDelete,
}: HAInstanceProps) => {
  const { id, name, hass_url } = instance;
  const [isDeletePending, startDelete] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { connected, entities } = useHA();
  const entityCount = Object.keys(entities ?? {}).length;

  const handleDelete = () => {
    startDelete(true);
    onDelete(id);
    startDelete(false);
  };

  return (
    <>
      <div
        key={id}
        className={cn(
          "flex items-center justify-between gap-3 p-3 rounded-md",
          {
            "bg-green-800 border border-green-200": connected,
            "bg-amber-800 border border-amber-200": !connected,
          }
        )}
      >
        <div className="min-w-0">
          <div className="font-medium truncate">{name}</div>
          <div
            className={cn(
              "flex gap-2 text-sm text-foreground-500",
              {
                "flex-col items-start": compact,
                "items-center": !compact,
              }
            )}
          >
            <span>{hass_url}</span>
            <div className="flex items-center gap-2">
              <Chip
                size="sm"
                color="default"
                variant="flat"
                startContent={
                  <Icon path={mdiCheckCircle} className="w-3 h-3" />
                }
              >
                {entityCount} entities
              </Chip>
              <Chip
                size="sm"
                color="default"
                variant="flat"
                startContent={
                  <Icon
                    path={connected ? mdiCheckCircle : mdiAlertCircle}
                    className="w-3 h-3"
                  />
                }
              >
                {connected ? "Connected" : "Disconnected"}
              </Chip>
            </div>
          </div>
        </div>

        {!compact && (
          <div className="flex gap-2">
            <Button
              size="sm"
              color="danger"
              onPress={() => setIsConfirmOpen(true)}
              isLoading={isDeletePending}
            >
              Delete
            </Button>
          </div>
        )}
        {!connected && (
          <Spinner color="primary" size="sm">
            Connecting...
          </Spinner>
        )}
      </div>
      <Modal
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        backdrop="blur"
      >
        <ModalContent className="bg-theme-background text-theme-text border border-theme-border">
          <ModalHeader className="flex flex-col gap-1">
            Confirm deletion
          </ModalHeader>
          <ModalBody>
            <p>
              This will remove the Home Assistant instance "{name}" from your
              account. You can add it again later.
            </p>
          </ModalBody>
          <ModalFooter className="justify-between">
            <Button variant="light" onPress={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={() => {
                setIsConfirmOpen(false);
                handleDelete();
              }}
              isLoading={isDeletePending}
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
