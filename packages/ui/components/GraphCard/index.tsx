import { useEntity, useEntityHistory } from "@repo/ha";
import Graph from "./Graph";
import Icon from "@mdi/react";
import { mdiAlert } from "@mdi/js";
import { Card, CardBody, Skeleton } from "@heroui/react";
import { useEntityLoading } from "@repo/hooks/useEntityLoading";
import { useMemo } from "react";

interface GraphCardProps {
  entityId: string;
  showStatistics: boolean;
}

const GraphCard = ({ entityId, showStatistics = false }: GraphCardProps) => {
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

  // Calculate statistics from history data
  const statistics = useMemo(() => {
    if (!history || !Array.isArray(history) || history.length === 0) {
      return { min: null, avg: null, max: null, minTime: null, maxTime: null };
    }

    const values = history
      .map((item: any) => {
        const value = parseFloat(String(item.s)) || 0;
        const time = item.lu || item.last_updated || item.last_changed;
        return { value, time: time ? new Date(time) : null };
      })
      .filter((item) => !isNaN(item.value));

    if (values.length === 0) {
      return { min: null, avg: null, max: null, minTime: null, maxTime: null };
    }

    const minItem = values.reduce((min, current) =>
      current.value < min.value ? current : min
    );
    const maxItem = values.reduce((max, current) =>
      current.value > max.value ? current : max
    );
    const avg =
      values.reduce((sum, item) => sum + item.value, 0) / values.length;

    return {
      min: minItem.value,
      avg: avg,
      max: maxItem.value,
      minTime: minItem.time,
      maxTime: maxItem.time,
    };
  }, [history]);

  // Mirror Light loading behavior (timeout-based unavailable detection)
  const { isEntityReady, showNotAvailable, isLoaded } =
    useEntityLoading(entity);

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
    <Skeleton isLoaded={isEntityReady} className="w-full h-auto rounded-2xl">
      {showNotAvailable ? (
        <div className="col-span-1 relative overflow-hidden w-full flex flex-col items-center justify-center p-6 bg-theme-surface border border-theme-border text-theme-error rounded-2xl h-40 gap-2">
          <Icon path={mdiAlert} className="h-8 w-8 text-theme-error" />
          <div className="text-center">
            <div className="text-sm font-medium">Sensor not available</div>
            <div className="text-xs opacity-80 break-all">{entityId}</div>
          </div>
        </div>
      ) : (
        <div className="col-span-1 relative overflow-hidden w-full flex flex-col bg-gradient-to-br-theme text-theme-text rounded-2xl shadow-card shadow-theme-surface">
          {/* Header */}
          <div className="flex flex-row w-full items-center justify-between p-3">
            <div className="text-xs font-bold">
              {entity?.attributes?.friendly_name || entityId}
            </div>
            <div className="text-xs text-theme-primary font-medium">
              {entity?.state}
              {unit}
            </div>
          </div>

          {/* Statistics */}
          {showStatistics && (
            <div className="flex flex-row w-full justify-between px-3 pb-2">
              <div className="flex flex-col items-center">
                <div className="text-xs text-theme-text-secondary font-medium">Min</div>
                <div className="text-sm font-bold text-theme-text">
                  {statistics.min !== null
                    ? `${statistics.min.toFixed(2)} ${unit}`
                    : "--"}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-xs text-theme-text-secondary font-medium">Avg</div>
                <div className="text-sm font-bold text-theme-text">
                  {statistics.avg !== null
                    ? `${statistics.avg.toFixed(2)} ${unit}`
                    : "--"}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-xs text-theme-text-secondary font-medium">Max</div>
                <div className="text-sm font-bold text-theme-text">
                  {statistics.max !== null
                    ? `${statistics.max.toFixed(2)} ${unit}`
                    : "--"}
                </div>
              </div>
            </div>
          )}

          {/* Graph */}
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
