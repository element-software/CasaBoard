import { EntityName, useEntity, useHistory } from "@hakit/core";
import ApexCharts from "apexcharts";
import { useEffect } from "react";

interface GraphCardProps {
  entityId: EntityName;
}

const GraphCard = ({ entityId }: GraphCardProps) => {
  const entity = useEntity(entityId);
  console.log("GraphCard entity", entity);
  const history = useHistory(entityId);
  console.log("GraphCard history", history);
  const data = history.entityHistory.slice(0,100).map((item) => ({ "y": item.s, "x": new Date(item.lu) }));
  console.log("GraphCard data", data);

  useEffect(() => {
    var options = {
      series: [
        {
          name: entity.attributes.friendly_name,
          data: data,
          zIndex: 1,
          color: "#cd192d"
        },
      ],
      chart: {
        type: "line",
        stacked: false,
        height: 160,
      },
      fill: {
        colors: ["#cd192d"],
        type: 'solid',
      },
      stroke: {
        curve: 'straight'
      },
      yaxis: {
        min: 400,
        max: 5000,
        lines: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false
        },
        crosshairs: {
          show: false
        }
      },
      xaxis: {
        type: "datetime",
        lines: {
          show: false,
        },
      },
      grid: {
        show: true,
      }
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
  }, [entity, history.coordinates]);

  return (
    <div className="col-span-1 relative overflow-hidden w-full flex flex-col items-center h-40 justify-between space-y-2 cursor-pointer bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-card shadow-neutral-800">
      <div className="text-base p-2">{entity.attributes.friendly_name}</div>
      <div id="chart" className="w-full h-40"></div>
    </div>
  );
};

export default GraphCard;
