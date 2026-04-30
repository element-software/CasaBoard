"use client";
import { Skeleton } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiAlert, mdiLightbulb } from "@mdi/js";
import EntityIcon from "../Shared/util/EntityIcon";
import { useEntity } from "@repo/ha";
import { useLightLoading, useLightController } from "./useLight";

interface LightProps {
  entityId: string;
  dimmer?: boolean;
  temperature?: boolean;
  color?: boolean;
  [key: string]: any;
}

export const Light = ({
  entityId,
  dimmer = false,
  temperature = false,
  color = false,
  ...props
}: LightProps) => {
  const entity = useEntity(entityId);

  const { isEntityReady, showNotAvailable, isLoaded } = useLightLoading(entity);

  const {
    isOn,
    brightnessPercentage,
    cardStyle,
    handleCardClick,
    handleCardDrag,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
  } = useLightController(entity, entityId, { dimmer });

  if (!entityId) {
    return (
      <div className="p-4 border-2 border-dashed border-theme-border rounded-xl text-center text-theme-text-muted">
        <Icon path={mdiLightbulb} className="h-12 w-12 mx-auto mb-2 opacity-40" />
        Configure Light Entity
      </div>
    );
  }

  const offStyle: React.CSSProperties = {
    backgroundColor: "var(--theme-entity-off)",
    color: "var(--theme-text)",
  };

  const onStyle: React.CSSProperties = {
    backgroundColor: "var(--theme-primary)",
    color: "var(--theme-text-on-primary)",
  };

  return (
    <Skeleton isLoaded={isLoaded} className="w-full h-16 rounded-xl">
      {showNotAvailable ? (
        <div className="border-2 border-dashed border-theme-border rounded-xl p-3 text-center text-theme-text-muted">
          <Icon path={mdiAlert} className="h-8 w-8 mx-auto mb-1 text-theme-error" />
          <p className="text-xs">Light not available</p>
        </div>
      ) : isEntityReady ? (
        <div
          key={entity?.entity_id || entityId}
          className="w-full cursor-pointer transition-all duration-200 hover:brightness-110 select-none rounded-xl overflow-hidden"
          onClick={handleCardClick}
          onMouseMove={dimmer ? handleCardDrag : undefined}
          onMouseDown={dimmer ? handleMouseDown : undefined}
          onMouseUp={dimmer ? handleMouseUp : undefined}
          onMouseLeave={dimmer ? handleMouseLeave : undefined}
          style={cardStyle ?? (isOn ? onStyle : offStyle)}
        >
          <div className="p-3 relative overflow-hidden">
            <div className="flex items-center gap-3 w-full">
              <EntityIcon
                entity={entity}
                className="h-8 w-8 flex-shrink-0"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <h3 className="text-sm font-semibold capitalize truncate">
                  {entity.attributes?.friendly_name ||
                    entity.entity_id ||
                    entityId}
                </h3>
                {dimmer && isOn && (
                  <div className="text-xs font-medium opacity-80">
                    {brightnessPercentage}%
                  </div>
                )}
              </div>
            </div>

            {dimmer && isOn && (
              <div
                className="absolute bottom-0 left-0 h-0.5 rounded-b-lg"
                style={{
                  width: `${brightnessPercentage}%`,
                  backgroundColor: "var(--theme-slider-thumb)",
                  boxShadow: `0 0 4px color-mix(in srgb, var(--theme-slider-thumb) 40%, transparent)`,
                  maxWidth: "100%",
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-theme-border rounded-xl p-3 text-center text-theme-text-muted">
          <Icon path={mdiLightbulb} className="h-8 w-8 mx-auto mb-1 opacity-40" />
          <p className="text-xs">Loading light...</p>
        </div>
      )}
    </Skeleton>
  );
};
