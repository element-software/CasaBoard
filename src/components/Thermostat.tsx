"use client";
import { EntityName, useEntity } from "@hakit/core";
import { mdiPower } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";

interface ThermostatProps {
  entityId: EntityName;
}

const Thermostat = ({ entityId }: ThermostatProps) => {
  const entity = useEntity(entityId);

  console.log("Thermostat entity", entity);

  // 10 is lowest, 32 is highest
  // map this to 0 - 60
  const percent = Math.round(
    (Math.round(entity.attributes.temperature - 10) / 22) * 100  );
    console.log(Math.round(entity.attributes.temperature))
    console.log("percent", percent);

  const stateClassname = entity.attributes.running_state === "heat" ? "text-black from-yellow-600 to-amber-500" : "text-white from-neutral-800 to-neutral-700 rounded-full";

  return (
    <div className="w-full p-4 text-center text-white bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl shadow-card shadow-neutral-800">
      <div className="flex flex-row items-center justify-between">
        <div className="text-xs">{entity.attributes.friendly_name}</div>
        <Icon path={mdiPower} className={classNames("h-10 w-10 p-2 rounded-full bg-gradient-to-l", stateClassname)} aria-hidden="true" />
      </div>
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
      <div className="flex flex-row items-center justify-around">
        <div className="flex flex-col">
          <div className="text-lg">{entity.attributes.current_temperature}°C</div>
          <div className="text-xs opacity-25">CURRENTLY</div>
        </div>
        <div className="flex flex-col">
          <div className="text-lg">{entity.state === "heat" ? "On" : "Off"}</div>
          <div className="text-xs opacity-25">HEATING</div>
        </div>
      </div>
    </div>
  );
};

export default Thermostat;
