import { DomainService, EntityName, useEntity, useHass } from "@hakit/core";
import { useCallback } from "react";
import { renderIcon } from "./utils";

interface EntityProps {
  entityId: EntityName;
  icon: string;
  showTitle?: boolean;
  disableClick?: boolean;
}

const Entity = ({ entityId, icon, showTitle = false, disableClick = false }: EntityProps ) => {
  const { callService } = useHass();
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

  return (
    <div onClick={() => toggleLighting("toggle", entityId)} className="flex flex-col items-center gap-2">
      {renderIcon(entity, icon)}
      {showTitle && <div className="text-xs">{entity.attributes.friendly_name}</div>}
    </div>
  );
}

export default Entity;