import { EntityName, useEntity, useHistory } from "@hakit/core";
import Graph from "./Graph";

interface GraphCardProps {
  entityId: EntityName;
}

const GraphCard = ({ entityId }: GraphCardProps) => {
  const entity = useEntity(entityId);
  const history = useHistory(entityId);
  const data = history.entityHistory.slice(0,20).map((item) => ({ "y": item.s, "x": new Date(item.lu) }));
  return (
    <div className="col-span-1 relative overflow-hidden w-full flex flex-col items-center h-40 justify-between space-y-2 cursor-pointer bg-gradient-to-br-theme text-theme-text rounded-2xl shadow-card shadow-theme-surface">
      <div className="flex flex-row w-full items-center justify-between">
        <div className="text-base p-2">{entity.attributes.friendly_name}</div>
        <div className="text-sm p-2 text-theme-primary">{entity.state}W</div>
      </div>
      <Graph data={history} className="overflow-hidden"/>
    </div>
  );
};

export default GraphCard;
