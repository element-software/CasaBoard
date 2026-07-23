"use client";
import { Skeleton } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiLightbulb } from "@mdi/js";
import EntityIcon from "../Shared/util/EntityIcon";
import { CardShell, IconBubble } from "../Shared/Card";
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
    color: "var(--theme-text-on)",
  };

  return (
    <Skeleton isLoaded={isLoaded} className="w-full min-h-16 rounded-xl">
      {showNotAvailable ? (
        <CardShell status="unavailable">
          <IconBubble
            icon={
              <Icon
                path={mdiLightbulb}
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
          key={entity?.entity_id || entityId}
          interactive
          style={cardStyle ?? (isOn ? onStyle : offStyle)}
          onClick={handleCardClick}
          onMouseMove={dimmer ? handleCardDrag : undefined}
          onMouseDown={dimmer ? handleMouseDown : undefined}
          onMouseUp={dimmer ? handleMouseUp : undefined}
          onMouseLeave={dimmer ? handleMouseLeave : undefined}
        >
          <IconBubble
            icon={<EntityIcon entity={entity} className="h-8 w-8" />}
            label={
              entity.attributes?.friendly_name || entity.entity_id || entityId
            }
            secondary={
              dimmer && isOn ? `${brightnessPercentage}%` : undefined
            }
          />

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
        </CardShell>
      ) : (
        <div className="rounded-xl p-3 text-center text-theme-text-muted opacity-0" />
      )}
    </Skeleton>
  );
};
