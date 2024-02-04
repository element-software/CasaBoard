import { EntityName } from "@hakit/core";
import Entity from "./Entity";
import classNames from "classnames";

interface EntityCardProps {
  title: string;
  entities: Entity[];
  colspan?: number;
}

interface Entity {
  id: EntityName;
  icon: string;
}

const EntityCard = ({ title, entities, colspan }: EntityCardProps) => {
  const getColspan = () => {
    return colspan ? `col-span-${colspan}` : "col-span-2";
  };

  return (
    <div
    className={classNames("relative overflow-hidden w-full flex flex-col items-center justify-between space-y-2 p-6 h-40 cursor-pointer bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-card shadow-neutral-800",
      getColspan()
    )}
  >
    {title}
    <div className="flex flex-row w-full items-center justify-between">
      {entities.map((entity) => (
        <Entity key={entity.id} entityId={entity.id} icon={entity.icon} />
      ))}
    </div>
  </div>
  )
}

export default EntityCard;