"use client";
import { EntityName, useHass } from "@hakit/core";
import Entity from "./Entity";
import classNames from "classnames";
import Icon from "@mdi/react";
import { mdiPower } from "@mdi/js";
import { useCallback, useState } from "react";

interface EntityCardProps {
  title: string;
  entities: Entity[];
  colspan?: number;
  showAllOn?: boolean;
  showTitles?: boolean;
  disableClick?: boolean;
}

interface Entity {
  id: EntityName;
  icon: string;
}

const EntityCard = ({ title, entities, colspan, showAllOn = false, showTitles = false, disableClick = false }: EntityCardProps) => {
  const getColspan = () => {
    return colspan ? `col-span-${colspan}` : "col-span-2";
  };
  
  const [allOn, setAllOn] = useState(false);

  const { callService } = useHass();
  
  const toggleLighting = useCallback(
    (entities: EntityName[]) => {
      callService({
        domain: "light",
        service: allOn ? "turn_off" : "turn_on",
        target: {
          entity_id: entities,
        },
      });
      setAllOn(!allOn);
    },
    [allOn, callService]
  );


  const stateClassname = allOn ? "text-black from-yellow-600 to-amber-500" : "text-white from-neutral-800 to-neutral-700 rounded-full";

  return (
    <div
      className={classNames(
        "relative overflow-hidden w-full flex flex-col items-center justify-between space-y-2 p-6 h-40 cursor-pointer bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-card shadow-neutral-800",
        getColspan()
      )}
    >
      <div className="flex flex-row w-full justify-between items-center">
        <div className="text-base">{title}</div>
        <div
          onClick={() => toggleLighting(entities.map((entity) => entity.id))}
          className={showAllOn ? "block" : "hidden"}
        >
          <Icon
            path={mdiPower}
            className={classNames("h-10 w-10 p-2 rounded-full bg-gradient-to-l", stateClassname)}
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="flex flex-row w-full items-center justify-between">
        {entities.map((entity) => (
          <Entity key={entity.id} entityId={entity.id} icon={entity.icon} showTitle={showTitles} />
        ))}
      </div>
    </div>
  );
}

export default EntityCard;