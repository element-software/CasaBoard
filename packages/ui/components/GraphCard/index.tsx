import { EntityName, useEntity, useHistory } from "@hakit/core";
import Graph from "./Graph";
import Icon from "@mdi/react";
import { mdiAlert } from "@mdi/js";

interface GraphCardProps {
  entityId: EntityName;
}

const GraphCard = ({ entityId }: GraphCardProps) => {
  const entity = useEntity(entityId);
  const history = useHistory(entityId, { 
    minimalResponse: true,
    hoursToShow: 24,
  });

  if (!entity || entity.state === 'unavailable' || entity.state === 'unknown') {
    return (
      <div className="col-span-1 relative overflow-hidden w-full flex flex-col items-center justify-center p-6 bg-red-500/20 border border-red-500/50 text-red-200 rounded-2xl h-40 gap-2">
        <Icon 
          path={mdiAlert} 
          className="h-8 w-8 text-red-500" 
        />
        <div className="text-center">
          <div className="text-sm font-medium">Sensor Entity Not Found</div>
          <div className="text-xs opacity-80 break-all">{entityId}</div>
        </div>
      </div>
    );
  }

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
