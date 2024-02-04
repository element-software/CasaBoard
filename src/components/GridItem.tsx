"use client";
import { EntityName, useEntity, useHass } from "@hakit/core";
import classNames from "classnames";
import { useCallback } from "react";
import Toggle from "./Toggle";
import Icon from '@mdi/react';
import { mdiDiamondStone, mdiLightRecessed, mdiLightbulb } from "@mdi/js";

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
        return "text-amber-500";
      case "off":
        return "text-gray-400";
      default:
        return "text-amber-500";
    }
  };

  const renderIcon = () => {
    switch (entity.attributes.icon) {
      case "mdi:light-recessed":
        return <Icon path={mdiLightRecessed} className={classNames("h-6 w-6", stateClassNameIcon())} aria-hidden="true" />;
      case "mdi:lightbulb":
        return <Icon path={mdiLightbulb} className={classNames("h-6 w-6", stateClassNameIcon())} aria-hidden="true" />;
      case "mdi:diamond-stone":
        return <Icon path={mdiDiamondStone} className={classNames("h-6 w-6", stateClassNameIcon())} aria-hidden="true" />;
      default:
        return <Icon path={mdiLightbulb} className={classNames("h-6 w-6", stateClassNameIcon())} aria-hidden="true" />;
    }
  };

  return (
    <div
      key={entity.entity_id}
      className={classNames(
        "relative overflow-hidden w-full flex flex-col items-center justify-between space-y-2 p-6 h-40 cursor-pointer bg-stone-500 bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-card shadow-neutral-800",
        stateClassNameBg()
      )}
      onClick={() => handleToggle(entity.entity_id as EntityName)}
    >
      <div className="flex flex-row w-full items-center justify-between">
        {renderIcon()}
        <Toggle
          enabled={entity.state === "on" ? true : false}
          onToggle={() =>
            entity.state === "on"
              ? handleTurnOff(entity.entity_id as EntityName)
              : handleTurnOn(entity.entity_id as EntityName)
          }
         />
      </div>

      <h3 className="w-full text-base capitalize text-white">
        {entity.attributes.friendly_name}
      </h3>
    </div>
  );
};

export default GridItem;
