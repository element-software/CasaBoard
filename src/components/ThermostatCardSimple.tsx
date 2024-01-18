import React from "react";
import { EntityName, useEntity } from "@hakit/core";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { FireIcon } from "@heroicons/react/20/solid";

interface ThermostatProps {
  entityId: EntityName;
}

const ThermostatCardSimple = ({ entityId }: ThermostatProps) => {
  const thermostat = useEntity(entityId);

  return (
    <div className="flex flex-col rounded-lg bg-[#313131] p-2 w-full items-stretch justify-evenly">
      <div className="w-full py-4 flex items-center justify-center relative mx-auto">
        <div className="w-1/2 flex flex-col items-center justify-items-stretch">
          <span className="text-xs text-white mb-1">Currently</span>
          <span className="text-sm text-white font-bold mb-4">
            {thermostat.attributes.local_temperature.toFixed(1)}°C
          </span>
          {thermostat.attributes.running_state === "idle" ? (
            <FireIcon className="w-10 h-10 text-gray-400" />
          ) : (
            <FireIcon className="w-10 h-10 text-red-400" />
          )}
        </div>
        <div className="w-1/2 flex flex-col items-center justify-items-stretch">
          <ChevronUpIcon
            className="w-6 h-6 mb-4"
            onClick={() => {
              thermostat.service.setTemperature({
                temperature: thermostat.attributes.temperature + 0.5,
              });
            }}
          />
          <span className="text-xl text-white font-bold">
            {Math.round(thermostat.attributes.temperature).toFixed(1)}°C
          </span>
          <ChevronDownIcon
            className="w-6 h-6 mt-4"
            onClick={() => {
              thermostat.service.setTemperature({
                temperature: thermostat.attributes.temperature - 0.5,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ThermostatCardSimple;
