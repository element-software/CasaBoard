"use client";
import { EntityName, useEntity } from "@hakit/core";
import classNames from "classnames";
import { BinarySensorUtils } from "@/utils";

interface GridItemProps {
  entityId: EntityName;
  friendlyName?: string;
}

export const BinarySensor = ({ entityId, friendlyName }: GridItemProps) => {
  const entity = useEntity(entityId);

  return (
    <div
      key={entity.entity_id}
      className={classNames(
        "relative overflow-hidden w-36 text-center flex flex-col items-center justify-between gap-4 p-6 h-44 cursor-pointer  bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-card shadow-neutral-800",
        BinarySensorUtils.stateClassNameBg(entity)
      )}
    >
      <h3 className="w-full text-base capitalize text-white">
        {friendlyName || entity.attributes.friendly_name}
      </h3>
      {BinarySensorUtils.renderIcon(entity)}
      <p
        className={classNames(
          "text-base",
          BinarySensorUtils.stateClassNameIcon(entity)
        )}
      >
        {BinarySensorUtils.renderState(entity)}
      </p>
      <p className="text-xs text-gray-400 m-0 -mt-4">{new Date(entity.last_changed).toLocaleTimeString()}</p>
    </div>
  );
};
