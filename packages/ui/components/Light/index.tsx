"use client";
import { Card, CardBody, cn, Skeleton } from "@heroui/react";
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

  // Loading and availability
  const { isEntityReady, showNotAvailable, isLoaded } = useLightLoading(entity);

  // Interactions and derived values
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

  // Early return for missing entityId - must come after all hooks
  if (!entityId) {
    return (
      <Card
        className="p-4 border-2 border-dashed"
        style={{
          borderColor: "border",
          backgroundColor: "background",
        }}
      >
        <CardBody className="text-center">
          <Icon path={mdiLightbulb} className="h-12 w-12 mx-auto mb-2" />
          <p>Configure Light Entity</p>
        </CardBody>
      </Card>
    );
  }

  // Render with Skeleton wrapper
  return (
    <Skeleton isLoaded={isLoaded} className="w-full h-16 rounded-xl">
      {showNotAvailable ? (
        <Card className="border-2 border-dashed">
          <CardBody className="text-center">
            <Icon path={mdiAlert} className="h-12 w-12 mx-auto mb-2" />
            <p>Light not available</p>
          </CardBody>
        </Card>
      ) : isEntityReady ? (
      <Card
        key={entity?.entity_id || entityId}
        className={cn(
          "w-full cursor-pointer transition-all duration-200 hover:shadow-lg select-none",
          {
            // If no dimmer and on → full primary background; else base background
            "bg-theme-primary text-white": isOn && !dimmer,
          }
        )}
        isPressable
        onPress={handleCardClick}
        onMouseMove={dimmer ? handleCardDrag : undefined}
        onMouseDown={dimmer ? handleMouseDown : undefined}
        onMouseUp={dimmer ? handleMouseUp : undefined}
        onMouseLeave={dimmer ? handleMouseLeave : undefined}
        style={cardStyle}
      >
        <CardBody className="p-3 relative overflow-hidden">
          <div className="flex items-center gap-3 w-full">
            {/* Entity Icon */}
            <EntityIcon
              entity={entity}
              className={cn("h-8 w-8 flex-shrink-0", {
                "text-white": isOn && !dimmer,
              })}
            />

            {/* Entity Name and Brightness */}
            <div className="flex flex-col flex-1 min-w-0">
              {/* Entity Name */}
              <h3 className="text-sm font-semibold capitalize truncate">
                {entity.attributes?.friendly_name ||
                  entity.entity_id ||
                  entityId}
              </h3>

              {/* Brightness Percentage (only show if dimmer is enabled and light is on) */}
              {dimmer && isOn && (
                <div className="text-xs font-medium">
                  {brightnessPercentage}%
                </div>
              )}
            </div>
          </div>

          {/* Visual brightness indicator line */}
          {dimmer && isOn && (
            <div
              className="absolute bottom-0 left-0 h-0.5 rounded-b-lg"
              style={{
                width: `${brightnessPercentage}%`,
                backgroundColor: "var(--theme-primary)",
                boxShadow: `0 0 4px var(--theme-primary)40`,
                maxWidth: "100%",
              }}
            />
          )}
        </CardBody>
      </Card>
      ) : (
        <Card className="p-2 border-2 border-dashed">
          <CardBody className="text-center">
            <Icon path={mdiLightbulb} className="h-12 w-12 mx-auto mb-2" />
            <p>Loading light...</p>
          </CardBody>
        </Card>
      )}
    </Skeleton>
  );
};
