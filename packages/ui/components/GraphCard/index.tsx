import { useEntity, useEntityHistory } from "@repo/ha";
import Graph from "./Graph";
import Icon from "@mdi/react";
import { mdiAlert } from "@mdi/js";
import { Card, CardBody, Skeleton } from "@heroui/react";
import { useEntityLoading } from "@repo/hooks/useEntityLoading";

interface GraphCardProps {
  entityId: string;
}

const GraphCard = ({ entityId }: GraphCardProps) => {
  // Early return for missing entityId - match Light's configure pattern
  if (!entityId) {
    return (
      <Card className="p-4 border-2 border-dashed">
        <CardBody className="text-center">
          <Icon path={mdiAlert} className="h-12 w-12 mx-auto mb-2" />
          <p>Configure Sensor Entity</p>
        </CardBody>
      </Card>
    );
  }

  const entity = useEntity(entityId);
  const { history, loading } = useEntityHistory(
    entityId,
    50,
    24 * 60 * 60 * 1000,
    "history"
  ); // Refresh every 10 seconds
  const unit = entity?.attributes?.unit_of_measurement || "W";

  // Mirror Light loading behavior (timeout-based unavailable detection)
  const { isEntityReady, showNotAvailable, isLoaded } = useEntityLoading(entity);

  console.log(
    "GraphCard: entityId:",
    entityId,
    "entity:",
    entity,
    "history:",
    history,
    "loading:",
    loading
  );

  return (
    <Skeleton isLoaded={isEntityReady} className="w-full h-40 rounded-2xl">
      {showNotAvailable ? (
        <div className="col-span-1 relative overflow-hidden w-full flex flex-col items-center justify-center p-6 bg-red-500/20 border border-red-500/50 text-red-200 rounded-2xl h-40 gap-2">
          <Icon path={mdiAlert} className="h-8 w-8 text-red-500" />
          <div className="text-center">
            <div className="text-sm font-medium">Sensor not available</div>
            <div className="text-xs opacity-80 break-all">{entityId}</div>
          </div>
        </div>
      ) : (
        <div className="col-span-1 relative overflow-hidden w-full flex flex-col items-center h-40 justify-between space-y-2 cursor-pointer bg-gradient-to-br-theme text-theme-text rounded-2xl shadow-card shadow-theme-surface">
          <div className="flex flex-row w-full items-center justify-between">
            <div className="text-base p-2">{entity?.attributes?.friendly_name || entityId}</div>
            <div className="text-sm p-2 text-theme-primary">
              {entity?.state}
              {unit}
            </div>
          </div>
          <Graph
            data={{ entityHistory: history, unit }}
            className="overflow-hidden"
          />
        </div>
      )}
    </Skeleton>
  );
};

export default GraphCard;
