"use client";
import { EntityName, useEntity } from "@hakit/core";
import { Card, CardBody, Chip } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiMotionSensor, mdiAlert } from "@mdi/js";
import EntityIcon from "@repo/ui/components/EntityIcon";
import { useComponentTheme } from "@repo/hooks/useTheme";

interface BinarySensorProps {
  entityId: EntityName;
  [key: string]: any;
}

export const BinarySensor = ({
  entityId,
  ...props
}: BinarySensorProps) => {
  const themeUtils = useComponentTheme();
  
  // All hooks must be called before any conditional returns
  const entity = useEntity(entityId, { returnNullIfNotFound: true });

  if (!entityId) {
    return (
      <Card
        className="p-4 border-2 border-dashed"
        style={{
          borderColor: themeUtils.getBorderColor(),
          backgroundColor: themeUtils.getCardStyles().backgroundColor,
        }}
      >
        <CardBody className="text-center" style={{ color: themeUtils.getTextColor("secondary") }}>
          <Icon
            path={mdiMotionSensor}
            className="h-12 w-12 mx-auto mb-2"
            style={{ color: themeUtils.getTextColor("secondary") }}
          />
          <p>Configure Binary Sensor Entity</p>
        </CardBody>
      </Card>
    );
  }

  if (!entity || entity.state === "unavailable" || entity.state === "unknown") {
    const errorColor = themeUtils.getEntityStateColor("unavailable");
    return (
      <Card
        style={{
          backgroundColor: `${errorColor}20`,
          borderColor: `${errorColor}50`,
        }}
      >
        <CardBody className="flex flex-col items-center justify-center p-6 gap-2" style={{ color: errorColor }}>
          <Icon path={mdiAlert} className="h-8 w-8" style={{ color: errorColor }} />
          <div className="text-center">
            <div className="text-sm font-medium">Binary Sensor Entity Not Found</div>
            <div className="text-xs opacity-80 break-all">{entityId}</div>
          </div>
        </CardBody>
      </Card>
    );
  }

  const cardStyles = themeUtils.getCardStyles(entity.state);
  const shadowStyles = themeUtils.getShadowStyles(entity.state);
  const hoverStyles = themeUtils.getHoverStyles(entity.state);

  return (
    <Card
      key={entity.entity_id}
      className="w-full transition-all duration-200"
      style={{
        ...cardStyles,
        ...shadowStyles,
        ...hoverStyles,
      }}
    >
      <CardBody className="p-4">
        <div className="flex flex-row w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <EntityIcon
              entity={entity}
              className="h-8 w-8"
              style={{ color: themeUtils.getIconColor(entity.state) }}
            />
            <div>
              <h3
                className="text-base font-medium capitalize"
                style={{ color: themeUtils.getTextColor("primary") }}
              >
                {entity.attributes.friendly_name}
              </h3>
              <Chip
                size="sm"
                color={themeUtils.getChipColor(entity.state)}
                variant="flat"
                startContent={
                  <Icon
                    path={mdiMotionSensor}
                    className="h-3 w-3"
                  />
                }
              >
                {entity.state === "on" ? "Detected" : "Clear"}
              </Chip>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};