import { DomainService, EntityName, HassEntityWithService, useEntity, useHass } from "@hakit/core";
import { useCallback, useState } from "react";
import { renderIcon } from "./utils";
import { renderState } from "@/utils/binarySensor";
import Icon from "@mdi/react";
import { mdiShieldAlert } from "@mdi/js";
import classNames from "classnames";

interface EntityCardProps {
  entityId: EntityName;
  icon: string;
  showTitle?: boolean;
  showState?: boolean;
  showLastChanged?: boolean;
  disableClick?: boolean;
}

const EntityCard = ({
  entityId,
  icon,
  showTitle = false,
  disableClick = false,
  showState = false,
  showLastChanged = false,
}: EntityCardProps) => {

    const { callService } = useHass();
    
    // Always call the hook, but handle errors in the component logic
    const entity = useEntity(entityId);

    const toggleLighting = useCallback(
      (action: DomainService<"light">, entities: EntityName) => {
        if (disableClick) return;
        callService({
          domain: "light",
          service: action,
          target: {
            entity_id: entities,
          },
        });
      },
      [callService, disableClick]
    );
  
    if (!entity)
      return (
        <div
          key={entityId}
          className="flex flex-col items-center gap-2 text-center"
        >
          <Icon
            path={mdiShieldAlert}
            className={classNames("h-8 w-8", "text-theme-error")}
            aria-hidden="true"
          />
          <p className="text-xs text-theme-text-secondary">Unavailable</p>
        </div>
      );

  return (
    <div
      onClick={() => toggleLighting("toggle", entityId)}
      className="flex flex-col items-center gap-2 text-center"
    >
      {renderIcon(entity, icon)}
      {showTitle && (
        <div className="text-xs">{entity.attributes.friendly_name}</div>
      )}
      {showState && (
        <div className="text-xs text-theme-text-secondary m-0 -mt-2">
          {renderState(entity as any)}
        </div>
      )}
      {showLastChanged && (
        <p className="text-[10px] text-theme-text-secondary">
          Last Changed {new Date(entity.last_changed).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default EntityCard;
