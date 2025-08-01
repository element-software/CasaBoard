"use client";
import { EntityName, useEntity } from "@hakit/core";
import classNames from "classnames";
import { BinarySensorUtils } from "@/utils";

interface GridItemProps {
  entityId: EntityName;
  friendlyName?: string;
  asCard?: boolean;
}

export const BinarySensor = ({ entityId, friendlyName, asCard = true }: GridItemProps) => {
  const entity = useEntity(entityId);

  return (
    <div
      key={entity.entity_id}
      className={classNames(
        "relative overflow-hidden w-full text-center flex flex-col items-center justify-between gap-4 p-6 h-44 cursor-pointer text-theme-text",
        {
          "bg-gradient-to-br-theme rounded-2xl shadow-card shadow-theme-surface": asCard,
        },
        BinarySensorUtils.stateClassNameBg(entity)
      )}
    >
      <h3 className="w-full text-base capitalize text-theme-text">
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
      <p className="text-xs text-theme-secondary m-0 -mt-4">{new Date(entity.last_changed).toLocaleTimeString()}</p>
    </div>
  );
};
