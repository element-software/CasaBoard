/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { ApexOptions } from "apexcharts";
import dynamic from 'next/dynamic';
import { useMemo, useCallback } from "react";

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });
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
    const last50 = data.entityHistory.slice(Math.max(0, data.entityHistory.length - 50));
    return last50.map((item: any) => {
      const y = typeof item.s !== 'undefined' ? item.s : item.state;
      const time = item.lu || item.last_updated || item.last_changed;
      return {
        y,
        x: time ? new Date(time) : new Date(),
      };
    });
  }, [data?.entityHistory]);

  const series = useMemo((): ApexAxisChartSeries => [
    {
      name: data.title || "Energy Use",
      data: processedData,
      zIndex: 1,
      color: "#8b5cf6",
      type: "area",
    },
  ], [processedData]);

  const unit = data?.unit || "W";
  const dataLabelFormatter = useCallback((val: any) => Math.round(val) + unit, [unit]);
  const tooltipFormatter = useCallback((val: any) => val + unit, [unit]);

  var options: ApexOptions = useMemo(() => ({
    chart: {
      id: "energy-graph",
      toolbar: {
        show: false
      },
      animations: {
        enabled: false,
      },
    },
    grid: {
      show: false,
    },
    yaxis: {
      show: false,
      labels: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    dataLabels: {
      enabled: true,
      background: {
        enabled: false,
      },
      style: {
        colors: ["#FFFFFF"],
        fontSize: "8px"
      },
      formatter: dataLabelFormatter,
      textAnchor: "middle",
      offsetY: -6,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.3,
        stops: [0, 100],
        gradientToColors: ["#8b5cf6"],
      },
    },
    stroke: { width: 2, curve: 'smooth' },
    markers: {
      size: 3,
      colors: ["#8b5cf6"],
      strokeColors: "#FFFFFF",
      strokeWidth: 1,
      fillOpacity: 1,
      shape: "circle",
      radius: 2,
      discrete: [],
    },
    tooltip: {
      shared: false,
      intersect: false,
      followCursor: false,
      fixed: {
        enabled: true,
        position: "topRight",
        offsetY: 0,
        offsetX: 0,
      },
      theme: "dark",
      style: {
        fontSize: "12px",
      },
      items: {
        display: "flex",
      },
      y: {
        formatter: tooltipFormatter,
      },
      x: {
        show: false,
      }
    },
    noData: {
      text: "Loading...",
    },
  }), [dataLabelFormatter, tooltipFormatter]);

  const chart = useMemo(() => {
    return <ApexCharts type="area" options={options} series={series} height={150} width={800} />
  }, [options, series]);

  return (
    <div className={className}>
      {chart}
    </div>
  );
};

export default Graph;
