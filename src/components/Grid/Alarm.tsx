"use client";
import { EntityName, HassEntityWithService, useEntity } from "@hakit/core";
import classNames from "classnames";
import Icon from "@mdi/react";
import { mdiShieldAlert, mdiShieldLock, mdiShieldLockOpen } from "@mdi/js";
import { useState } from "react";
import { AlarmUtils } from "@/utils";

interface GridItemProps {
  entityId: EntityName;
}

export const Alarm = ({ entityId }: GridItemProps) => {
  const [entity, setEntity] =
    useState<HassEntityWithService<"alarmControlPanel">>();

  try {
    const alarmEntity = useEntity(entityId);
    if (!entity) setEntity(alarmEntity);
  } catch (error) {
    console.error("Error fetching entity", error);
  }

  if (!entity)
    return (
      <div
        key={entityId}
        className="relative overflow-hidden w-full text-center flex flex-col items-center justify-between gap-2 p-6 h-44 cursor-pointer  bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-card shadow-neutral-800"
      >
        <Icon
          path={mdiShieldAlert}
          className={classNames("h-12 w-12", "text-red-500")}
          aria-hidden="true"
        />
        <p className="text-xs text-gray-400">{entityId}</p>
        <p className="text-xs text-gray-400">Unavailable</p>
      </div>
    );

  return (
    <div
      key={entity.entity_id}
      className={classNames(
        "relative overflow-hidden w-full text-center flex flex-col items-center justify-between gap-2 p-6 h-44 cursor-pointer  bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-card shadow-neutral-800",
        AlarmUtils.stateClassNameBg(entity)
      )}
    >
      {AlarmUtils.renderIcon(entity)}
      {entity.state.split("_")[0][0].toUpperCase() +
        entity.state.split("_")[0].slice(1) +
        " " +
        (entity.state.split("_")[1] || "")}
      <p className="text-xs text-gray-400">
        Last Changed {new Date(entity.last_changed).toLocaleTimeString()}
      </p>
    </div>
  );
};
