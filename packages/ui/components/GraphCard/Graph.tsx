/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  VictoryChart,
  VictoryArea,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import { useId, useMemo } from "react";

interface GraphCardProps {
  data: any;
  className?: string;
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
    return data.entityHistory.map((item: any) => {
      const y = String(item.s);
      const time = item.lu || item.last_updated || item.last_changed;
      return {
        y: parseFloat(y) || 0,
        x: time ? new Date(time) : new Date(),
      };
    });
  }, [data?.entityHistory]);

  const unit = data?.unit || "W";

  if (processedData.length === 0) {
    return null;
  }

  return (
    <div className={className ? `relative ${className}` : "relative"}>
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
              stopOpacity={0.6}
            />
            <stop
              offset="50%"
              stopColor="var(--theme-chart-fill)"
              stopOpacity={0.3}
            />
            <stop
              offset="100%"
              stopColor="var(--theme-chart-fill)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
      </svg>
      <VictoryChart
        height={450}
        width={1920}
        padding={{ top: 20, bottom: 60, left: 60, right: 20 }}
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
                  strokeWidth: 2,
                }}
                style={{
                  fill: "white",
                  fontSize: 40,
                  fontWeight: 600,
                }}
              />
            }
          />
        }
        theme={{
          axis: {
            style: {
              //axis: { stroke: "white", strokeWidth: 2 },
              ticks: { stroke: "white", strokeWidth: 1 },
              tickLabels: { fill: "transparent", fontSize: 48, fontWeight: 600, fontFamily: "Inter" },
              grid: { stroke: "transparent" },
              //axisLabel: { fill: "white", fontSize: 48, fontWeight: 700, fontFamily: "Inter" },
            },
          },
        }}
      >
        <VictoryArea
          data={processedData}
          style={{
            data: {
              fill: `url(#${gradientId})`,
              fillOpacity: 0.4,
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
