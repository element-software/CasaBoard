"use client";
import { useEntity } from "@repo/ha";
import classNames from "classnames";
import Icon from "@mdi/react";
import { mdiShieldAlert } from "@mdi/js";
import { AlarmUtils } from "@repo/utils";
import EntityIcon from "../Shared/util/EntityIcon";

export interface AlarmProps {
  entityId: string;
}

export const Alarm = ({ entityId }: AlarmProps) => {
  // Always call the hook, but handle errors in the component logic
  const entity = useEntity(entityId);

  if (!entityId)
    return (
      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
        Configure Alarm Entity
      </div>
    );

  if (!entity)
    return (
      <div
        key={entityId}
        className="relative overflow-hidden w-full text-center flex flex-col items-center justify-between gap-2 p-6 h-44 cursor-pointer bg-gradient-to-br-theme text-theme-text rounded-2xl shadow-card shadow-theme-surface"
      >
        <Icon
          path={mdiShieldAlert}
          className={classNames("h-12 w-12", "text-theme-error")}
          aria-hidden="true"
        />
        <p className="text-xs text-theme-text-secondary">{entityId}</p>
        <p className="text-xs text-theme-text-secondary">Unavailable</p>
      </div>
    );

  return (
    <div
      key={entity.entity_id}
      className={classNames(
        "relative overflow-hidden w-full text-center flex flex-col items-center justify-between gap-2 p-6 h-44 cursor-pointer bg-gradient-to-br-theme text-theme-text rounded-2xl shadow-card shadow-theme-surface",
        AlarmUtils.stateClassNameBg(entity as any)
      )}
    >
      <EntityIcon entity={entity} />
      {entity.state.split("_")[0][0].toUpperCase() +
        entity.state.split("_")[0].slice(1) +
        " " +
        (entity.state.split("_")[1] || "")}
      <p className="text-xs text-theme-text-secondary">
        Last Changed {new Date(entity.last_changed).toLocaleTimeString()}
      </p>
    </div>
  );
};
