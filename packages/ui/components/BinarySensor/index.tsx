"use client";
import { EntityName, useEntity } from "@hakit/core";
import { Card, CardBody, Chip } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiMotionSensor, mdiAlert } from "@mdi/js";
import EntityIcon from "@repo/ui/components/EntityIcon";

interface BinarySensorProps {
  entityId: EntityName;
  [key: string]: any;
}

export const BinarySensor = ({ entityId, ...props }: BinarySensorProps) => {
  // All hooks must be called before any conditional returns
  const entity = useEntity(entityId, { returnNullIfNotFound: true });

  if (!entityId) {
    return (
      <Card className="p-4 border-2 border-dashed">
        <CardBody className="text-center">
          <Icon path={mdiMotionSensor} className="h-12 w-12 mx-auto mb-2" />
          <p>Configure Binary Sensor Entity</p>
        </CardBody>
      </Card>
    );
  }

  if (!entity || entity.state === "unavailable" || entity.state === "unknown") {
    return (
      <Card>
        <CardBody className="flex flex-col items-center justify-center p-6 gap-2">
          <Icon path={mdiAlert} className="h-8 w-8" />
          <div className="text-center">
            <div className="text-sm font-medium">
              Binary Sensor Entity Not Found
            </div>
            <div className="text-xs opacity-80 break-all">{entityId}</div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card key={entity.entity_id} className="w-full transition-all duration-200">
      <CardBody className="p-4">
        <div className="flex flex-row w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <EntityIcon entity={entity} className="h-8 w-8" />
            <div>
              <h3 className="text-base font-medium capitalize">
                {entity.attributes.friendly_name}
              </h3>
              <Chip
                size="sm"
                variant="flat"
                startContent={
                  <Icon path={mdiMotionSensor} className="h-3 w-3" />
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
