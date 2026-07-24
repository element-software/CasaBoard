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
  // Prefer long-term statistics (downsampled); hook falls back to raw history / REST / live append
  const { history, loading } = useEntityHistory(
    entityId,
    96,
    24 * 60 * 60 * 1000,
    "statistics"
  );
  const unit = entity?.attributes?.unit_of_measurement || "W";

  const chartHistory = useMemo(() => {
    if (history.length > 0) return history;
    // When recorder history is unavailable, seed a short flat line from the live state
    // so the card isn't blank while live updates accumulate.
    if (entity?.state != null && Number.isFinite(parseFloat(String(entity.state)))) {
      const end = Date.parse(
        String(entity.last_updated ?? entity.last_changed ?? "")
      );
      const endMs = Number.isFinite(end) ? end : Date.now();
      return [
        { s: String(entity.state), lu: endMs - 60_000 },
        { s: String(entity.state), lu: endMs },
      ];
    }
    return history;
  }, [history, entity]);

  const statistics = useMemo(() => {
    if (!chartHistory || chartHistory.length === 0) {
      return { min: null, avg: null, max: null };
    }

    const values = chartHistory
      .map((item) => parseFloat(String(item.s)))
      .filter((value) => Number.isFinite(value));

    if (values.length === 0) {
      return { min: null, avg: null, max: null };
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;

    return { min, avg, max };
  }, [chartHistory]);

  const { isEntityReady, showNotAvailable } = useEntityLoading(entity);

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
        <CardShell
          domain="graph"
          className="col-span-1 flex flex-col bg-theme-card text-theme-text"
        >
          <div className="flex flex-col px-[var(--style-shell-padding,0.75rem)] pt-[var(--style-shell-padding,0.75rem)]">
            <div className="flex flex-row w-full items-center justify-between gap-2">
              <div className="min-w-0 text-xs font-bold">
                {name?.trim() || entity?.attributes?.friendly_name || entityId}
              </div>
              <div className="shrink-0 text-xs text-theme-primary font-medium">
                {formatSensorValue(entity?.state)}
                {unit}
              </div>
            </div>

            {showStatistics && (
              <div className="flex flex-row w-full justify-between pb-2 pt-3">
                <div className="flex flex-col items-center">
                  <div className="text-xs text-theme-text-secondary font-medium">Min</div>
                  <div className="text-sm font-bold text-theme-text">
                    {statistics.min !== null
                      ? `${statistics.min.toFixed(2)} ${unit}`
                      : loading
                        ? "…"
                        : "--"}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-xs text-theme-text-secondary font-medium">Avg</div>
                  <div className="text-sm font-bold text-theme-text">
                    {statistics.avg !== null
                      ? `${statistics.avg.toFixed(2)} ${unit}`
                      : loading
                        ? "…"
                        : "--"}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-xs text-theme-text-secondary font-medium">Max</div>
                  <div className="text-sm font-bold text-theme-text">
                    {statistics.max !== null
                      ? `${statistics.max.toFixed(2)} ${unit}`
                      : loading
                        ? "…"
                        : "--"}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Graph
            data={{ entityHistory: chartHistory, unit }}
            className="mt-auto h-28 w-full shrink-0"
          />
        </CardShell>
      )}
    </Skeleton>
  );
};

export default GraphCard;
