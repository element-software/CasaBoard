import { useCallback } from "react";
import EntityIcon from "../Shared/util/EntityIcon";
import { BinarySensorUtils } from "@repo/utils";
import { Skeleton } from "@heroui/react";
import { useEntity, useHA } from "@repo/ha";
import { useEntityLoading } from "@repo/hooks/useEntityLoading";

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
  const entity = useEntity(entityId);
  const { isEntityReady, showNotAvailable, isLoaded } = useEntityLoading(entity);

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

  return (
    <Skeleton isLoaded={isLoaded} className="rounded-lg">
      {showNotAvailable ? (
        <div
          key={entityId}
          className="flex flex-col items-center gap-2 text-center p-2 rounded-lg opacity-50"
        >
          <div className="h-6 w-6 rounded-full bg-theme-border" />
          {showTitle && (
            <div className="text-[10px] text-theme-text-muted break-all">{entityId}</div>
          )}
        </div>
      ) : isEntityReady ? (
        <div
          onClick={() => toggleLighting(entityId)}
          className="flex flex-col items-center gap-2 text-center"
        >
          <EntityIcon entity={entity!} size="h-8 w-8" />
          {showTitle && (
            <div className="text-xs">{entity!.attributes.friendly_name}</div>
          )}
          {showState && (
            <div className="text-xs text-theme-secondary m-0 -mt-2">
              {BinarySensorUtils.renderState(entity as any)}
            </div>
          )}
          {showLastChanged && (
            <p className="text-[10px] text-theme-secondary">
              Last Changed {new Date(entity!.last_changed).toLocaleTimeString()}
            </p>
          )}
        </div>
      ) : (
        <div className="h-8 w-8 rounded-lg opacity-0" />
      )}
    </Skeleton>
  );
};

export default EntityCard;
