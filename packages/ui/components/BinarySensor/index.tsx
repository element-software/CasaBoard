"use client";
import Icon from "@mdi/react";
import { mdiMotionSensor } from "@mdi/js";
import EntityIcon from "../Shared/util/EntityIcon";
import { BinarySensorUtils } from "@repo/utils";
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
    <Skeleton isLoaded={isLoaded} className="w-full h-16 rounded-xl">
      {showNotAvailable ? (
        <div className="rounded-xl p-3 flex items-center gap-3 opacity-50">
          <Icon path={mdiMotionSensor} className="h-8 w-8 flex-shrink-0 text-theme-text-muted" />
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-semibold text-theme-text-muted truncate">{entityId}</p>
            <p className="text-xs text-theme-text-muted">Unavailable</p>
          </div>
        </div>
      ) : isEntityReady ? (
        <div
          key={entity!.entity_id}
          className="w-full transition-all duration-200 rounded-xl"
          style={{
            backgroundColor: entity!.state === "on" ? "var(--theme-entity-on)" : "var(--theme-entity-off)",
            color: entity!.state === "on" ? "var(--theme-text-on-primary)" : "var(--theme-text)",
          }}
        >
          <div className="p-4">
            <div className="flex flex-row w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <EntityIcon entity={entity!} className={`h-8 w-8 ${BinarySensorUtils.stateClassNameIcon(entity as any)}`} />
                <div>
                  <h3 className="text-base font-medium capitalize">
                    {entity!.attributes.friendly_name}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5 text-xs opacity-80">
                    <Icon path={mdiMotionSensor} className="h-3 w-3" />
                    {BinarySensorUtils.renderState(entity as any)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl p-3 opacity-0" />
      )}
    </Skeleton>
  );
};
