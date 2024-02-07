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


  // 10 is lowest, 32 is highest
  // map this to 0 - 60
  const percent = Math.round(
    (Math.round(entity.attributes.temperature - 10) / 22) * 100  );

  const stateClassname = entity.attributes.running_state === "heat" ? "text-black from-yellow-600 to-amber-500" : "text-white from-neutral-800 to-neutral-700 rounded-full";

  return (
    <div className="w-full p-4 text-center flex flex-col gap-1 text-white bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl shadow-card shadow-neutral-800">
      <div className="flex flex-row items-center justify-between">
        <div className="text-xs">{entity.attributes.friendly_name}</div>
        <Icon path={mdiPower} className={classNames("h-10 w-10 p-2 rounded-full bg-gradient-to-l", stateClassname)} aria-hidden="true" />
      </div>
      <div className="p-2 bg-gradient-to-l from-neutral-800 to-neutral-900 rounded-full ">
        <svg className="w-full h-full" viewBox="0 0 80 80">
          <circle
            className="text-neutral-800 stroke-current"
            strokeWidth="3"
            cx="40"
            cy="40"
            r="30"
            fill="transparent"
          ></circle>
          <circle
            className="text-amber-500 progress-ring__circle stroke-current"
            strokeWidth="3"
            strokeLinecap="round"
            cx="40"
            cy="40"
            r="30"
            fill="transparent"
            strokeDashoffset={`calc(400 - (400 * ${(60 * percent) / 100}) / 100)`}
          ></circle>

          <text
            x="40"
            y="40"
            fontSize="10"
            textAnchor="middle"
            alignmentBaseline="middle"
            className="text-base fill-white"
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
