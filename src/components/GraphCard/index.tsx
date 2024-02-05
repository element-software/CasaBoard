import { EntityName, useEntity, useHistory } from "@hakit/core";
import Graph from "./Graph";

interface GraphCardProps {
  entityId: EntityName;
}

const GraphCard = ({ entityId }: GraphCardProps) => {
  const entity = useEntity(entityId);
  console.log("GraphCard entity", entity);
  const history = useHistory(entityId);
  console.log("GraphCard history", history);
  const data = history.entityHistory.slice(0,20).map((item) => ({ "y": item.s, "x": new Date(item.lu) }));
  console.log("GraphCard data", data);
  return (
    <div className="col-span-1 relative overflow-hidden w-full flex flex-col items-center h-40 justify-between space-y-2 cursor-pointer bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-card shadow-neutral-800">
      <div className="flex flex-row w-full items-center justify-between">
        <div className="text-base p-2">{entity.attributes.friendly_name}</div>
        <div className="text-sm p-2 text-amber-500">{entity.state}W</div>
      </div>
      <Graph data={history} className="overflow-hidden"/>
    </div>
  );
};

export default GraphCard;
