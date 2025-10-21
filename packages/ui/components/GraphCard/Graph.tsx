/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  VictoryChart,
  VictoryArea,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import { useMemo } from "react";

interface GraphCardProps {
  data: any;
  className?: string;
}

const Graph = ({ data, className }: GraphCardProps) => {
  console.log("Graph data", data);

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

  return (
    <div className={className}>
      <VictoryChart
        height={150}
        width={1920}
        padding={{ top: 20, bottom: 20, left: 20, right: 20 }}
        containerComponent={
          <VictoryVoronoiContainer
            labels={({ datum }) => `${Math.round(datum.y)}${unit}`}
            labelComponent={
              <VictoryTooltip
                flyoutStyle={{
                  fill: "var(--theme-card-background)",
                  stroke: "var(--theme-border)",
                  strokeWidth: 1,
                }}
                style={{
                  fill: "var(--theme-text)",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              />
            }
          />
        }
        theme={{
          axis: {
            style: {
              axis: { stroke: "transparent" },
              ticks: { stroke: "transparent" },
              tickLabels: { fill: "transparent" },
              grid: { stroke: "transparent" },
            },
          },
        }}
      >
        <VictoryArea
          data={processedData}
          style={{
            data: {
              fill: "url(#gradient)",
              fillOpacity: 0.4,
              stroke: "var(--theme-primary)",
              strokeWidth: 2,
              strokeLinecap: "round",
              strokeLinejoin: "round",
            },
          }}
          animate={{
            duration: 0,
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stopColor="var(--theme-primary)"
              stopOpacity={0.6}
            />
            <stop
              offset="50%"
              stopColor="var(--theme-primary)"
              stopOpacity={0.3}
            />
            <stop
              offset="100%"
              stopColor="var(--theme-primary)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
      </VictoryChart>
    </div>
  );
};

export default Graph;
