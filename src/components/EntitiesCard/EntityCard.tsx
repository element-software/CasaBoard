import { DomainService, EntityName, useEntity, useHass } from "@hakit/core";
import { useCallback } from "react";
import { renderIcon } from "./utils";
import { renderState } from "@/utils/binarySensor";

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
  const entity = useEntity(entityId);
  console.log("Entity:: entity", entity);

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
        <div className="text-xs text-gray-400 m-0 -mt-2">
          {renderState(entity)}
        </div>
      )}
      {showLastChanged && (
        <p className="text-[10px] text-gray-400">
          Last Changed {new Date(entity.last_changed).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default EntityCard;
