"use client";
import { EntityName, useEntity } from "@hakit/core";
import classNames from "classnames";
import Icon from "@mdi/react";
import {
  mdiDoorClosed,
  mdiDoorOpen,
  mdiShieldAlert,
  mdiShieldLock,
  mdiShieldLockOpen,
} from "@mdi/js";

interface GridItemProps {
  entityId: EntityName;
}

export const Entity = ({ entityId }: GridItemProps) => {
  const entity = useEntity(entityId);

  console.log("Entity entity", entity);

  const stateClassNameBg = () => {
    switch (entity.state) {
      case "disarmed":
        return "bg-gray-800";
      case "armed_night":
        return "bg-stone-800";
      default:
        return "";
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
    switch (entity.state) {
      case "on":
        return (
          <Icon
            path={mdiDoorOpen}
            className={classNames("h-12 w-12", "text-amber-500")}
            aria-hidden="true"
          />
        );
      case "off":
        return (
          <Icon
            path={mdiDoorClosed}
            className={classNames("h-12 w-12", "text-gray-400")}
            aria-hidden="true"
          />
        );
      default:
        return (
          <Icon
            path={mdiDoorOpen}
            className={classNames("h-12 w-12", "text-red-500")}
            aria-hidden="true"
          />
        );
    }
  };

  return (
    <div
      key={entity.entity_id}
      className={classNames(
        "relative overflow-hidden w-36 text-center flex flex-col items-center justify-between gap-4 p-6 h-44 cursor-pointer  bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-card shadow-neutral-800",
        stateClassNameBg()
      )}
    >
      <h3 className="w-full text-base capitalize text-white">{entity.attributes.friendly_name}</h3>
      {renderIcon()}
        <p className={classNames("text-base", stateClassNameIcon())}>
          {entity.state === "off" ? "Closed" : "Open"}
        </p>
    </div>
  );
};
