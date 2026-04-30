"use client";
import Icon from "@mdi/react";
import { mdiMotionSensor, mdiAlert } from "@mdi/js";
import EntityIcon from "../Shared/util/EntityIcon";
import { BinarySensorUtils } from "@repo/utils";
import { useEntity } from "@repo/ha";

interface BinarySensorProps {
  entityId: string;
  [key: string]: any;
}

export const BinarySensor = ({ entityId, ...props }: BinarySensorProps) => {
  const entity = useEntity(entityId);

  if (!entityId) {
    return (
      <div className="p-4 border-2 border-dashed border-theme-border rounded-xl text-center text-theme-text-muted">
        <Icon path={mdiMotionSensor} className="h-12 w-12 mx-auto mb-2 opacity-40" />
        Configure Binary Sensor Entity
      </div>
    );
  }

  if (!entity || entity.state === "unavailable" || entity.state === "unknown") {
    return (
      <div className="rounded-xl p-4 border border-theme-border bg-theme-surface flex flex-col items-center justify-center gap-2">
        <Icon path={mdiAlert} className="h-8 w-8 text-theme-error" />
        <div className="text-center">
          <div className="text-sm font-medium text-theme-text">Binary Sensor Not Found</div>
          <div className="text-xs text-theme-text-muted break-all">{entityId}</div>
        </div>
      </div>
    );
  }

  const isOn = entity.state === "on";
  const iconClass = BinarySensorUtils.stateClassNameIcon(entity as any);

  return (
    <div
      key={entity.entity_id}
      className="w-full transition-all duration-200 rounded-xl"
      style={{
        backgroundColor: isOn ? "var(--theme-entity-on)" : "var(--theme-entity-off)",
        color: isOn ? "var(--theme-text-on-primary)" : "var(--theme-text)",
      }}
    >
      <div className="p-4">
        <div className="flex flex-row w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <EntityIcon entity={entity} className={`h-8 w-8 ${iconClass}`} />
            <div>
              <h3 className="text-base font-medium capitalize">
                {entity.attributes.friendly_name}
              </h3>
              <div
                className="flex items-center gap-1 mt-0.5 text-xs opacity-80"
              >
                <Icon path={mdiMotionSensor} className="h-3 w-3" />
                {BinarySensorUtils.renderState(entity as any)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
