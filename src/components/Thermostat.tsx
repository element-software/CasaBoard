"use client";
import { EntityName, useEntity } from "@hakit/core";

interface ThermostatProps {
  entityId: EntityName;
}

const Thermostat = ({ entityId }: ThermostatProps) => {
  const entity = useEntity(entityId);

  // 10 is lowest, 32 is highest
  // map this to 0 - 60
  const percent = Math.round(
    (Math.round(entity.attributes.temperature - 10) / 22) * 100  );
    console.log(Math.round(entity.attributes.temperature))
    console.log("percent", percent);

  return (
    <div className="w-full p-4 text-center bg-stone-500/80 text-white rounded-lg">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-200 stroke-current"
            stroke-width="10"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
          ></circle>
          <circle
            className="text-indigo-500 progress-ring__circle stroke-current"
            stroke-width="10"
            stroke-linecap="round"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke-dashoffset={`calc(400 - (400 * ${(60 * percent) / 100}) / 100)`}
          ></circle>

          <text
            x="50"
            y="50"
            font-family="Verdana"
            font-size="12"
            text-anchor="middle"
            alignment-baseline="middle"
            className="text-md tracking-widest fill-white"
          >
              {entity.attributes.temperature}°C
          </text>
        </svg>
      </div>
      <div className="text-lg tracking-wider">{entity.state}</div>
    </div>
  );
};

export default Thermostat;
