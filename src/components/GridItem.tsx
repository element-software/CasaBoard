"use client";
import { EntityName, useEntity, useHass } from "@hakit/core";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/20/solid";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useCallback } from "react";

interface GridItemProps {
  entityId: EntityName;
}
const GridItem = ({ entityId }: GridItemProps) => {
  const entity = useEntity(entityId);
  console.log("entity", entity);

  const { callService } = useHass();

  const handleTurnOn = useCallback(
    (entityId: EntityName) => {
      console.log(entityId);
      callService({
        domain: "light",
        service: "turn_on",
        target: {
          entity_id: entityId,
        },
      });
    },
    [callService]
  );

  const handleTurnOff = useCallback(
    (entityId: EntityName) => {
      console.log(entityId);
      callService({
        domain: "light",
        service: "turn_off",
        target: {
          entity_id: entityId,
        },
      });
    },
    [callService]
  );

  const handleToggle = useCallback(
    (entityId: EntityName) => {
      console.log(entityId);
      callService({
        domain: "light",
        service: "toggle",
        target: {
          entity_id: entityId,
        },
      });
    },
    [callService]
  );

  const stateClassNameBg = () => {
    switch (entity.state) {
      case "on":
        return "bg-stone-500";
      case "off":
        return "bg-stone-800";
      default:
        return "bg-stone-500";
    }
  };

  const stateClassNameIcon = () => {
    switch (entity.state) {
      case "on":
        return "text-yellow-400";
      case "off":
        return "text-gray-400";
      default:
        return "text-yellow-400";
    }
  };

  return (
    <div
      key={entity.entity_id}
      className={classNames(
        "w-full shadow flex flex-col items-center text-center justify-between space-y-2 p-6 h-36",
        stateClassNameBg()
      )}
      onClick={() => handleToggle(entity.entity_id as EntityName)}
    >
      <h3 className="w-full text-sm font-medium uppercase text-white">
        {entity.attributes.friendly_name}
      </h3>
      <LightBulbIcon
        className={classNames("h-8 w-8", stateClassNameIcon())}
        aria-hidden="true"
      />
    </div>
  );
};

export default GridItem;
