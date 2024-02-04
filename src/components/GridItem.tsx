"use client";
import { EntityName, useEntity, useHass } from "@hakit/core";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useCallback } from "react";
import Toggle from "./Toggle";

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
        return "bg-stone-800";
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

  const stateClassNameIconBg = () => {
    switch (entity.state) {
      case "on":
        return "bg-yellow-800";
      case "off":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      key={entity.entity_id}
      className={classNames(
        "relative overflow-hidden w-full flex flex-col items-center text-center justify-between space-y-2 p-6 h-40 cursor-pointer bg-stone-500 bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-lg shadow-neutral-800",
        stateClassNameBg()
      )}
      onClick={() => handleToggle(entity.entity_id as EntityName)}
    >
      <div className="flex flex-row w-full items-center justify-between">
        <LightBulbIcon className={classNames("h-10 w-10", stateClassNameIcon())} aria-hidden="true" />
        <Toggle />
      </div>

      <h3 className="w-full text-md font-bold uppercase text-white">
          {entity.attributes.friendly_name}
        </h3>

      <div className={classNames("absolute -left-4 -bottom-4 rounded-full p-6", stateClassNameIconBg())}>
        <LightBulbIcon className={classNames("h-10 w-10", stateClassNameIcon())} aria-hidden="true" />
      </div>
    </div>
  );
};

export default GridItem;
