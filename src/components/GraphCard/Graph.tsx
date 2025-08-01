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
  
  const processedData = useMemo(() => {
    if (!data?.entityHistory || !Array.isArray(data.entityHistory)) {
      return [];
    }
    return data.entityHistory.slice(data.entityHistory.length - 20).map((item: any) => ({
      "y": item.s,
      "x": new Date(item.lu)
    }));
  }, [data?.entityHistory]);

  const series = useMemo((): ApexAxisChartSeries => [
    {
      name: "Energy Use",
      data: processedData,
      zIndex: 1,
      color: "var(--color-primary)",
      type: "area",
    },
  ], [processedData]);

  const dataLabelFormatter = useCallback((val: any) => Math.round(val) + "W", []);
  const tooltipFormatter = useCallback((val: any) => val + "W", []);

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
        colors: ["var(--color-text)"],
        fontSize: "9px"
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
        gradientToColors: ["var(--color-primary)"],
      },
    },
    stroke: { width: 2, curve: 'smooth' },
    markers: {
      size: 3,
      colors: ["var(--color-primary)"],
      strokeColors: "var(--color-text)",
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
