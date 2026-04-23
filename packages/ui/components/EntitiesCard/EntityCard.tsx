import { useCallback } from "react";
import EntityIcon from "../Shared/util/EntityIcon";
import { BinarySensorUtils } from "@repo/utils";
import Icon from "@mdi/react";
import { mdiShieldAlert, mdiAlert } from "@mdi/js";
import classNames from "classnames";
import { useEntity, useHA } from "@repo/ha";

interface EntityCardProps {
  entityId: string;
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

    const { connection } = useHA();
    
    // Always call the hook, but handle errors in the component logic
    const entity = useEntity(entityId);

    const toggleLighting = useCallback(
      async (entities: string) => {
        if (disableClick || !connection) return;
        const service = entity?.state === "on" ? "turn_off" : "turn_on";
        await connection.sendMessagePromise({
          type: "call_service",
          domain: "light",
          service,
          service_data: { entity_id: entities },
        });
      },
      [connection, disableClick, entity?.state]
    );
  
    if (!entity || entity.state === 'unavailable' || entity.state === 'unknown')
      return (
        <div
          key={entityId}
          className="flex flex-col items-center gap-2 text-center p-2 rounded-lg border border-theme-error bg-theme-surface"
        >
          <Icon
            path={mdiAlert}
            className={classNames("h-6 w-6", "text-theme-error")}
            aria-hidden="true"
          />
          <div className="text-xs text-theme-text-secondary">
            <div className="font-medium">Entity Not Found</div>
            <div className="text-[10px] opacity-80 break-all">{entityId}</div>
          </div>
        </div>
      );

  return (
    <div
      onClick={() => toggleLighting(entityId)}
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
