"use client";
import { useEntity, useHA } from "@repo/ha";
import { Card, CardBody, Switch as HeroSwitch, Chip, Skeleton } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiPower } from "@mdi/js";
import { useCallback } from "react";
import EntityIcon from "../Shared/util/EntityIcon";
import { useEntityLoading } from "@repo/hooks/useEntityLoading";

interface SwitchProps {
  entityId: string;
  [key: string]: any;
}

export const Switch = ({ entityId, ...props }: SwitchProps) => {
  const entity = useEntity(entityId);
  const { connection } = useHA();
  const { isEntityReady, showNotAvailable, isLoaded } = useEntityLoading(entity);

  const handleToggle = useCallback(
    async (entityId: string) => {
      if (!entity || !connection) return;
      const domain = entityId.split('.')[0];
      const service = entity.state === "on" ? "turn_off" : "turn_on";
      await connection.sendMessagePromise({
        type: "call_service",
        domain,
        service,
        service_data: { entity_id: entityId },
      });
    },
    [connection, entity]
  );

  const handleCardClick = useCallback(() => {
    if (entity) {
      handleToggle(entity.entity_id as string);
    }
  }, [entity, handleToggle]);

  if (!entityId) {
    return (
      <Card className="p-4 border-2 border-dashed">
        <CardBody className="text-center">
          <Icon path={mdiPower} className="h-12 w-12 mx-auto mb-2" />
          <p>Configure Switch Entity</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Skeleton isLoaded={isLoaded} className="w-full h-16 rounded-xl">
      {showNotAvailable ? (
        <div className="rounded-xl p-3 flex items-center gap-3 opacity-50">
          <Icon path={mdiPower} className="h-8 w-8 flex-shrink-0 text-theme-text-muted" />
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-semibold text-theme-text-muted truncate">{entityId}</p>
            <p className="text-xs text-theme-text-muted">Unavailable</p>
          </div>
        </div>
      ) : isEntityReady ? (
        <Card
          key={entity!.entity_id}
          className="w-full cursor-pointer transition-all duration-200 hover:shadow-lg"
          isPressable
          onPress={handleCardClick}
        >
          <CardBody className="p-4">
            <div className="flex flex-row w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <EntityIcon entity={entity!} className="h-8 w-8" />
                <div>
                  <h3 className="text-base font-medium capitalize">
                    {entity!.attributes.friendly_name}
                  </h3>
                  <Chip
                    size="sm"
                    variant="flat"
                    startContent={<Icon path={mdiPower} className="h-3 w-3" />}
                  >
                    {entity!.state === "on" ? "On" : "Off"}
                  </Chip>
                </div>
              </div>
              <HeroSwitch
                isSelected={entity!.state === "on"}
                color="primary"
                size="lg"
                isReadOnly
              />
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="rounded-xl p-3 opacity-0" />
      )}
    </Skeleton>
  );
};
