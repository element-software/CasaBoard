"use client";
import { EntityName, useEntity } from "@hakit/core";
import classNames from "classnames";
import Icon from "@mdi/react";
import { mdiAlarmPanel } from "@mdi/js";

interface GridItemProps {
  entityId: EntityName;
}

export const Alarm = ({ entityId }: GridItemProps) => {
  const entity = useEntity(entityId);

  //console.log("Alarm entity", entity);

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
      case "armed_night":
        return "text-amber-500";
      case "disarmed":
        return "text-gray-400";
      default:
        return "text-amber-500";
    }
  };

  return (
    <div
      key={entity.entity_id}
      className={classNames(
        "relative overflow-hidden w-full flex flex-col items-center justify-between space-y-2 p-6 h-40 cursor-pointer  bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-card shadow-neutral-800",
        stateClassNameBg()
      )}
    >
      <div className="flex flex-row w-full items-center justify-between">
        <Icon
          path={mdiAlarmPanel}
          className={classNames("h-10 w-10", stateClassNameIcon())}
          aria-hidden="true"
        />
        {entity.state.split("_")[0][0].toUpperCase() +
          entity.state.split("_")[0].slice(1) +
          (entity.state.split("_")[1] || "")}
      </div>
      <h3 className="w-full text-base capitalize text-white">Alarm</h3>
    </div>
  );
};
