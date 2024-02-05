import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

interface GraphCardProps {
  data: any;
  className?: string;
}

const Graph = ({ data, className }: GraphCardProps) => {
  console.log("Graph Data", data);

  const d = data.entityHistory.slice(0,20).map((item: any) => ({ "y": item.s, "x": new Date(item.lu) }));

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
      min: 400,
      max: 1400,
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
    series: [
      {
        name: "Energy Use",
        data: d,
        zIndex: 1,
        color: "#f59e0b",
      },
    ],
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

  return (
    <div className={className}>
      <ReactApexChart type="area" options={options} series={options.series} height={150} width={400} />
    </div>
  );
};

export default Graph;
