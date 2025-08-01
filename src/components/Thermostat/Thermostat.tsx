"use client";
import { EntityName, useEntity } from "@hakit/core";
import { mdiPower } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";

interface ThermostatProps {
  entityId: EntityName;
}

export const Thermostat = ({ entityId }: ThermostatProps) => {
  const entity = useEntity(entityId);

  // 10 is lowest, 32 is highest
  // map this to 0 - 60
  const currentPercent = Math.round(
    (Math.round(entity.attributes.current_temperature - 10) / 22) * 100
  );

  const targetPercent = Math.round(
    (Math.round(entity.attributes.temperature - 10) / 22) * 100
  );

  return (
    <div className="w-full p-4 text-center flex flex-col gap-1 text-theme-text bg-gradient-theme rounded-2xl shadow-card shadow-theme-surface">
      <div className="flex flex-row items-center justify-between">
        <div className="text-xs">{entity.attributes.friendly_name}</div>
        <Icon
          path={mdiPower}
          className={classNames("h-10 w-10 p-2 rounded-full", {
            "linear-gradient(to left, var(--color-warning), var(--color-primary)) text-black":
              entity.attributes.running_state === "heat",
              "text-theme-text bg-theme-surface rounded-full": entity.attributes.running_state !== "heat",
          })}
          aria-hidden="true"
        />
      </div>
      <div className="p-2 bg-gradient-theme rounded-full ">
        <svg className="w-full h-full" viewBox="0 0 80 80">
          <circle
            className="stroke-theme-surface stroke-current"
            strokeWidth="3"
            cx="40"
            cy="40"
            r="30"
            fill="transparent"
          ></circle>
          <circle
            className="stroke-theme-primary progress-ring__circle stroke-current !rotate-[180deg]"
            strokeWidth="3"
            strokeLinecap="round"
            cx="40"
            cy="40"
            r="30"
            fill="transparent"
            strokeDashoffset={`calc(450 - (350 * ${(60 * targetPercent) / 100}) / 100)`}
          ></circle>
          <circle
            className="stroke-theme-accent progress-ring__circle stroke-current !rotate-[180deg]"
            strokeWidth="3"
            strokeLinecap="round"
            cx="40"
            cy="40"
            r="30"
            fill="transparent"
            strokeDashoffset={`calc(450 - (350 * ${(60 * currentPercent) / 100}) / 100)`}
          ></circle>
          <text
            x="40"
            y="40"
            fontSize="10"
            textAnchor="middle"
            alignmentBaseline="middle"
            className="text-base fill-theme-text"
          >
            {entity.attributes.temperature}°C
          </text>
          <text
            x="40"
            y="53"
            fontSize="2"
            textAnchor="middle"
            alignmentBaseline="middle"
            className="text-[6px] fill-theme-text-secondary opacity-25"
          >
            TARGET
          </text>
        </svg>
      </div>
      <div className="flex flex-row items-center justify-around">
        <div className="flex flex-col">
          <div className="text-lg">
            {entity.attributes.current_temperature}°C
          </div>
          <div className="text-xs opacity-25">CURRENTLY</div>
        </div>
        <div className="flex flex-col">
          <div className="text-lg">
            {entity.state === "heat" ? "On" : "Off"}
          </div>
          <div className="text-xs opacity-25">HEATING</div>
        </div>
      </div>
    </div>
  );
};
