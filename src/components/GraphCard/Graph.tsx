/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { ApexOptions } from "apexcharts";
import dynamic from 'next/dynamic';
import { useMemo } from "react";

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });
interface GraphCardProps {
  data: any;
  className?: string;
}

const Graph = ({ data, className }: GraphCardProps) => {
  console.log("Graph Data", data);

  const d = data.entityHistory.slice(0,20).map((item: any) => ({ "y": item.s, "x": new Date(item.lu) }));
  const series = [
    {
      name: "Energy Use",
      data: d,
      zIndex: 1,
      color: "#f59e0b",
    },
  ];

  var options: ApexOptions = {
    chart: {
      id: "energy-graph",
      toolbar: {
        show: false
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
      enabled: false,
      background: {
        enabled: false,
      },
      style: {
        colors: ["#fff"],
      },
      formatter: function (val: any) {
        return Math.round(val) + "W";
      },
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
        gradientToColors: ["#f59e0b"],
      },
    },
    // colors: ["#f59e0b"],
    stroke: { width: 3, curve: 'smooth' },
    // annotations: {
    //   points: [{
    //     x: d[0].x,
    //     y: d[0].y,
    //     marker: {
    //       size: 8,
    //       fillColor: '#fff',
    //       strokeColor: 'red',
    //       radius: 2,
    //       cssClass: 'apexcharts-custom-class'
    //     },
    //     label: {
    //       borderColor: '#FF4560',
    //       offsetY: 0,
    //       style: {
    //         color: '#fff',
    //         background: '#FF4560',
    //       },
    
    //       text: 'Point Annotation',
    //     }
    //   }],
    // },
  };

  const chart = useMemo(() => {
    return <ApexCharts type="area" options={options} series={series} height={150} width={400} />
  }, [options, series]);

  return (
    <div className={className}>
      {chart}
    </div>
  );
};

export default Graph;
