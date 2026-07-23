"use client";
import Icon from "@mdi/react";
import { mdiMotionSensor } from "@mdi/js";
import EntityIcon from "../Shared/util/EntityIcon";
import { BinarySensorUtils } from "@repo/utils";
import { CardShell, IconBubble } from "../Shared/Card";
import { useEntity } from "@repo/ha";
import { Skeleton } from "@heroui/react";
import { useEntityLoading } from "@repo/hooks/useEntityLoading";

interface BinarySensorProps {
  entityId: string;
  [key: string]: any;
}

export const BinarySensor = ({ entityId, ...props }: BinarySensorProps) => {
  const entity = useEntity(entityId);
  const { isEntityReady, showNotAvailable, isLoaded } = useEntityLoading(entity);

  if (!entityId) {
    return (
      <div className="p-4 border-2 border-dashed border-theme-border rounded-xl text-center text-theme-text-muted">
        <Icon path={mdiMotionSensor} className="h-12 w-12 mx-auto mb-2 opacity-40" />
        Configure Binary Sensor Entity
      </div>
    );
  }

  return (
    <Skeleton isLoaded={isLoaded} className="w-full min-h-16 rounded-xl">
      {showNotAvailable ? (
        <CardShell status="unavailable">
          <IconBubble
            icon={
              <Icon
                path={mdiMotionSensor}
                className="h-8 w-8 text-theme-text-muted"
              />
            }
            label={<span className="text-theme-text-muted">{entityId}</span>}
            secondary={
              <span className="text-theme-text-muted">Unavailable</span>
            }
          />
        </CardShell>
      ) : isEntityReady ? (
        <CardShell
          key={entity!.entity_id}
          style={{
            backgroundColor: entity!.state === "on" ? "var(--theme-entity-on)" : "var(--theme-entity-off)",
            color: entity!.state === "on" ? "var(--theme-text-on-primary)" : "var(--theme-text)",
          }}
        >
          <IconBubble
            icon={
              <EntityIcon
                entity={entity!}
                className={`h-8 w-8 ${BinarySensorUtils.stateClassNameIcon(entity as any)}`}
              />
            }
            label={entity!.attributes.friendly_name}
            secondary={
              <span className="inline-flex items-center gap-1">
                <Icon path={mdiMotionSensor} className="h-3 w-3" />
                {BinarySensorUtils.renderState(entity as any)}
              </span>
            }
          />
        </CardShell>
      ) : (
        <div className="rounded-xl p-3 opacity-0" />
      )}
    </Skeleton>
  );
};
