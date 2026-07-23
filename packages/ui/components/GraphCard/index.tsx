import { useEntity, useEntityHistory } from "@repo/ha";
import Graph from "./Graph";
import Icon from "@mdi/react";
import { mdiAlert } from "@mdi/js";
import { Card, CardBody, Skeleton } from "@heroui/react";
import { useEntityLoading } from "@repo/hooks/useEntityLoading";
import { CardShell, IconBubble } from "../Shared/Card";
import { useMemo } from "react";

interface GraphCardProps {
  entityId: string;
  name?: string;
  showStatistics: boolean;
}

function formatSensorValue(value: string | number | null | undefined): string {
  const num = typeof value === "number" ? value : parseFloat(String(value ?? ""));
  if (Number.isNaN(num)) return String(value ?? "--");
  return num.toFixed(2);
}

const GraphCard = ({
  entityId,
  name,
  showStatistics = false,
}: GraphCardProps) => {
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

  return (
    <Skeleton isLoaded={isEntityReady} className="w-full h-auto rounded-2xl">
      {showNotAvailable ? (
        <CardShell status="unavailable" className="col-span-1 h-40 flex items-center justify-center">
          <IconBubble
            icon={<Icon path={mdiAlert} className="h-8 w-8 text-theme-text-muted" />}
            label={<span className="text-theme-text-muted">Unavailable</span>}
            secondary={<span className="text-theme-text-muted break-all">{entityId}</span>}
          />
        </CardShell>
      ) : (
        <CardShell className="col-span-1 flex flex-col bg-theme-card text-theme-text">
          {/* Header */}
          <div className="flex flex-row w-full items-center justify-between gap-2">
            <div className="min-w-0 text-xs font-bold">
              {name?.trim() || entity?.attributes?.friendly_name || entityId}
            </div>
            <div className="shrink-0 text-xs text-theme-primary font-medium">
              {formatSensorValue(entity?.state)}
              {unit}
            </div>
          </div>

          {/* Statistics */}
          {showStatistics && (
            <div className="flex flex-row w-full justify-between pb-2 pt-3">
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
        </CardShell>
      )}
    </Skeleton>
  );
};

export default GraphCard;
