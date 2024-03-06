"use client";
import { EntityName, useEntity } from "@hakit/core";
import classNames from "classnames";
import Icon from "@mdi/react";
import {
  mdiShieldAlert,
  mdiShieldLock,
  mdiShieldLockOpen,
} from "@mdi/js";

interface GridItemProps {
  entityId: EntityName;
}

export const Alarm = ({ entityId }: GridItemProps) => {
  const entity = useEntity(entityId);
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

  const renderIcon = () => {
    switch (entity.state) {
      case "armed_night":
        return (
          <Icon
            path={mdiShieldLock}
            className={classNames("h-12 w-12", "text-amber-500")}
            aria-hidden="true"
          />
        );
      case "disarmed":
        return (
          <Icon
            path={mdiShieldLockOpen}
            className={classNames("h-12 w-12", "text-gray-400")}
            aria-hidden="true"
          />
        );
      default:
        return (
          <Icon
            path={mdiShieldAlert}
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
        "relative overflow-hidden w-36 text-center flex flex-col items-center justify-between gap-2 p-6 h-44 cursor-pointer  bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-card shadow-neutral-800",
        stateClassNameBg()
      )}
    >
      {renderIcon()}
      {entity.state.split("_")[0][0].toUpperCase() +
        entity.state.split("_")[0].slice(1) +
        " " +
        (entity.state.split("_")[1] || "")}
        <p className="text-xs text-gray-400">Last Changed {new Date(entity.last_changed).toLocaleTimeString()}</p>
    </div>
  );
};
