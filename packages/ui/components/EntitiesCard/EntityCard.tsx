import { DomainService, EntityName, useEntity, useHass } from "@hakit/core";
import { useCallback } from "react";
import EntityIcon from "@repo/ui/components/EntityIcon";
import { BinarySensorUtils } from "@repo/utils";
import Icon from "@mdi/react";
import { mdiShieldAlert, mdiAlert } from "@mdi/js";
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
  
    if (!entity || entity.state === 'unavailable' || entity.state === 'unknown')
      return (
        <div
          key={entityId}
          className="flex flex-col items-center gap-2 text-center p-2 bg-red-500/20 border border-red-500/50 rounded-lg"
        >
          <Icon
            path={mdiAlert}
            className={classNames("h-6 w-6", "text-red-500")}
            aria-hidden="true"
          />
          <div className="text-xs text-red-200">
            <div className="font-medium">Entity Not Found</div>
            <div className="text-[10px] opacity-80 break-all">{entityId}</div>
          </div>
        </div>
      );

  return (
    <div
      onClick={() => toggleLighting("toggle", entityId)}
      className="flex flex-col items-center gap-2 text-center"
    >
      <EntityIcon entity={entity} size="h-8 w-8" />
      {showTitle && (
        <div className="text-xs">{entity.attributes.friendly_name}</div>
      )}
      {showState && (
        <div className="text-xs text-theme-secondary m-0 -mt-2">
          {BinarySensorUtils.renderState(entity as any)}
        </div>
      )}
      {showLastChanged && (
        <p className="text-[10px] text-theme-secondary">
          Last Changed {new Date(entity.last_changed).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default EntityCard;
