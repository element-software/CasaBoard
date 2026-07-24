/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  VictoryChart,
  VictoryArea,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import { useId, useMemo } from "react";
import { toChartDate } from "@repo/ha";
import classNames from "classnames";

interface GraphCardProps {
  data: any;
  className?: string;
}

function yDomainFor(values: number[]): [number, number] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
  if (min === max) {
    const pad = Math.abs(min) * 0.05 || 1;
    return [min - pad, max + pad];
  }
  const pad = (max - min) * 0.12;
  return [min - pad, max + pad];
}

const Graph = ({ data, className }: GraphCardProps) => {
  const reactGradientId = useId();
  const gradientId = useMemo(
    () => `graph-grad-${reactGradientId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    [reactGradientId]
  );

  const processedData = useMemo(() => {
    if (!data?.entityHistory || !Array.isArray(data.entityHistory)) {
      return [];
    }
    return data.entityHistory
      .map((item: any) => {
        const y = parseFloat(String(item.s ?? item.state ?? ""));
        if (!Number.isFinite(y)) return null;
        const time = item.lu || item.last_updated || item.last_changed;
        return {
          y,
          x: toChartDate(time),
        };
      })
      .filter((p: { y: number; x: Date } | null): p is { y: number; x: Date } =>
        p != null
      );
  }, [data?.entityHistory]);

  const domainY = useMemo(
    () => yDomainFor(processedData.map((d: { y: number }) => d.y)),
    [processedData]
  );

  const unit = data?.unit || "W";

  if (processedData.length < 2) {
    return null;
  }

  return (
    <div
      className={classNames(
        "relative w-full overflow-hidden leading-none",
        className
      )}
    >
      <svg
        width={0}
        height={0}
        className="absolute overflow-hidden"
        aria-hidden
        focusable="false"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stopColor="var(--theme-chart-fill)"
              stopOpacity={0.55}
            />
            <stop
              offset="100%"
              stopColor="var(--theme-chart-fill)"
              stopOpacity={0.05}
            />
          </linearGradient>
        </defs>
      </svg>
      <VictoryChart
        height={160}
        width={640}
        padding={{ top: 6, bottom: 0, left: 0, right: 0 }}
        domain={{ y: domainY }}
        style={{
          parent: {
            width: "100%",
            height: "100%",
            display: "block",
          },
        }}
        containerComponent={
          <VictoryVoronoiContainer
            labels={({ datum }) =>
              `${Number(datum.y).toFixed(2)}${unit} at ${datum.x ? new Date(datum.x).toLocaleTimeString() : ""}`
            }
            labelComponent={
              <VictoryTooltip
                flyoutStyle={{
                  fill: "rgba(0, 0, 0, 0.9)",
                  stroke: "white",
                  strokeWidth: 1,
                }}
                style={{
                  fill: "white",
                  fontSize: 14,
                  fontWeight: 600,
                }}
                constrainToVisibleArea
              />
            }
          />
        }
      >
        <VictoryAxis
          style={{
            axis: { stroke: "transparent" },
            ticks: { stroke: "transparent" },
            tickLabels: { fill: "transparent", fontSize: 0 },
            grid: { stroke: "transparent" },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "transparent" },
            ticks: { stroke: "transparent" },
            tickLabels: { fill: "transparent", fontSize: 0 },
            grid: { stroke: "transparent" },
          }}
        />
        <VictoryArea
          data={processedData}
          interpolation="monotoneX"
          // Baseline at zoomed domain min — default y0=0 flattens high-range sensors (W, V)
          y0={() => domainY[0]}
          style={{
            data: {
              fill: `url(#${gradientId})`,
              fillOpacity: 1,
              stroke: "var(--theme-chart-line)",
              strokeWidth: 2,
              strokeLinecap: "round",
              strokeLinejoin: "round",
            },
          }}
          animate={{
            duration: 0,
          }}
        />
      </VictoryChart>
    </div>
  );
};

export default Graph;
