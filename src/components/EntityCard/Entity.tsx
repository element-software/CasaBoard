import { DomainService, EntityName, useEntity, useHass } from "@hakit/core";
import { mdiCountertop, mdiDiamondStone, mdiFileCabinet, mdiLedStripVariant, mdiLightRecessed, mdiLightbulb, mdiToasterOven } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { useCallback } from "react";

interface EntityProps {
  entityId: EntityName;
  icon: string;
}

const Entity = ({ entityId, icon }: EntityProps ) => {
  const { callService } = useHass();
  const entity = useEntity(entityId);

  const toggleLighting = useCallback(
    (action: DomainService<"light">, entities: EntityName) => {
      console.log("toggleLighting", action, entities);
      callService({
        domain: "light",
        service: action,
        target: {
          entity_id: entities,
        },
      });
    },
    [callService]
  );

  const stateClassNameIcon = () => {
    switch (entity.state) {
      case "on":
        return "text-amber-500";
      case "off":
        return "text-gray-400";
      default:
        return "text-amber-500";
    }
  };

  const renderIcon = () => {
    switch (icon) {
      case "mdiFileCabinet":
        return <Icon path={mdiFileCabinet} className={classNames("h-10 w-10", stateClassNameIcon())}/>;
      case "mdiToasterOven":
        return <Icon path={mdiToasterOven} className={classNames("h-10 w-10", stateClassNameIcon())}/>;
      case "mdiLightRecessed":
        return <Icon path={mdiLightRecessed} className={classNames("h-10 w-10", stateClassNameIcon())}/>;
      case "mdiDiamondStone":
        return <Icon path={mdiDiamondStone} className={classNames("h-10 w-10", stateClassNameIcon())}/>;
      case "mdiLightbulb":
        return <Icon path={mdiLightbulb} className={classNames("h-10 w-10", stateClassNameIcon())}/>;
      case "mdiCountertop":
        return <Icon path={mdiCountertop} className={classNames("h-10 w-10", stateClassNameIcon())}/>;
      case "mdiLedStripVariant":
        return <Icon path={mdiLedStripVariant} className={classNames("h-10 w-10", stateClassNameIcon())}/>;
      default:
        return <Icon path={mdiLightbulb} className={classNames("h-10 w-10", stateClassNameIcon())}/>;
    }
  }

  return (
    <div onClick={() => toggleLighting("toggle", entityId)}>
      {renderIcon()}
    </div>
  );
}

export default Entity;