"use client";
import { useEntity, useHA } from "@repo/ha";
import { mdiPlus, mdiMinus, mdiPower, mdiAlert } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { useCallback, useMemo, useState } from "react";

interface ThermostatProps {
  entityId: string;
}

export const Thermostat = ({ entityId }: ThermostatProps) => {
  const entity = useEntity(entityId);
  const { connection } = useHA();
  const [targetTemp, setTargetTemp] = useState<number>(
    entity.attributes.temperature
  );
  // Get temperature color based on current temperature
  const getTemperatureColor = useCallback((temp: number) => {
    if (temp >= 25) return "text-red-500";
    if (temp >= 20) return "text-orange-500";
    if (temp >= 15) return "text-yellow-500";
    if (temp >= 10) return "text-blue-400";
    return "text-blue-600";
  }, []);

  // Get status color and text
  const statusInfo = useMemo(() => {
    const isHeating = entity.attributes.hvac_action === "heating";
    return {
      text: isHeating ? "HEATING" : "IDLE",
      color: isHeating
        ? "text-red-500 bg-red-500/20"
        : "text-theme-text-secondary bg-theme-secondary/50",
    };
  }, [entity.attributes.hvac_action]);

  const currentTemp = entity.attributes.current_temperature;

  const tempColorClasses = getTemperatureColor(currentTemp);

  // Handlers for temperature adjustment (you'll need to implement these based on your HA setup)
  const increaseTemp = useCallback(() => {
    setTargetTemp((prev) => {
      const newTemp = prev + 0.5;
      if (connection) {
        connection.sendMessagePromise({
          type: "call_service",
          domain: "climate",
          service: "set_temperature",
          service_data: { entity_id: entityId, temperature: newTemp, hvac_mode: "heat" },
        });
      }
      return newTemp;
    });
  }, [entityId, connection]);

  const decreaseTemp = useCallback(() => {
    setTargetTemp((prev) => {
      const newTemp = prev - 0.5;
      if (connection) {
        connection.sendMessagePromise({
          type: "call_service",
          domain: "climate",
          service: "set_temperature",
          service_data: { entity_id: entityId, temperature: newTemp, hvac_mode: "heat" },
        });
      }
      return newTemp;
    });
  }, [entityId, connection]);

  if (!entity || entity.state === 'unavailable' || entity.state === 'unknown') {
    return (
      <div className="w-full p-6 flex flex-col items-center justify-center bg-red-500/20 border border-red-500/50 text-red-200 rounded-2xl gap-2">
        <Icon 
          path={mdiAlert} 
          className="h-8 w-8 text-red-500" 
        />
        <div className="text-center">
          <div className="text-sm font-medium">Thermostat Entity Not Found</div>
          <div className="text-xs opacity-80 break-all">{entityId}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 text-center flex flex-col gap-4 text-theme-text bg-gradient-theme rounded-2xl shadow-card shadow-theme-surface">
      {/* Header */}
      <div className="flex flex-row items-center justify-between">
        <div className="text-sm font-medium">
          {entity.attributes.friendly_name}
        </div>
      </div>

      {/* Digital Display */}
      <div className="relative p-6">
        {/* Current Temperature - Large Display */}
        <div className="text-center mb-4">
          <div
            className={classNames(
              "text-4xl font-mono font-bold tracking-tight",
              tempColorClasses
            )}
          >
            {currentTemp}°C
          </div>
          <div className="text-xs opacity-60 uppercase tracking-wider mt-1">
            Current
          </div>
        </div>

        {/* Target Temperature Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={decreaseTemp}
            className="h-10 w-10 min-w-10 min-h-10 rounded-full bg-theme-secondary hover:bg-theme-primary transition-colors duration-200 flex items-center justify-center hover:scale-105 active:scale-95"
            aria-label="Decrease target temperature"
          >
            <Icon path={mdiMinus} className="h-5 w-5 text-theme-text" />
          </button>

          <div className="text-center min-w-[80px]">
            <div className="text-xl font-mono font-semibold">
              {targetTemp.toFixed(1)}°C
            </div>
            <div className="text-xs opacity-60 uppercase tracking-wider">
              Target
            </div>
          </div>

          <button
            onClick={increaseTemp}
            className="h-10 w-10 min-w-10 min-h-10 rounded-full bg-theme-secondary hover:bg-theme-primary transition-colors duration-200 flex items-center justify-center hover:scale-105 active:scale-95"
            aria-label="Increase target temperature"
          >
            <Icon path={mdiPlus} className="h-5 w-5 text-theme-text" />
          </button>
        </div>
      </div>

      {/* Status Display */}
      <div className="flex flex-row items-center justify-around">
        <div className="flex flex-col">
          <div
            className={classNames(
              "text-sm font-medium px-3 py-1 rounded-full",
              statusInfo.color
            )}
          >
            {statusInfo.text}
          </div>
          <div className="text-xs opacity-50 uppercase tracking-wider mt-1">
            Status
          </div>
        </div>

        <div className="flex flex-col">
          <div className="text-lg font-semibold">
            {Math.abs(targetTemp - currentTemp).toFixed(1)}°
          </div>
          <div className="text-xs opacity-50 uppercase tracking-wider">
            {targetTemp > currentTemp ? "To Heat" : "Difference"}
          </div>
        </div>
      </div>
    </div>
  );
};
