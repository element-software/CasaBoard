"use client";
import { useEntity, useHA } from "@repo/ha";
import { mdiPlus, mdiMinus, mdiAlert, mdiThermostat } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { useCallback, useMemo, useState, useEffect } from "react";

interface ThermostatProps {
  entityId: string;
}

export const Thermostat = ({ entityId }: ThermostatProps) => {
  const entity = useEntity(entityId);
  const { connection } = useHA();
  const [targetTemp, setTargetTemp] = useState<number>(0);

  useEffect(() => {
    if (entity?.attributes?.temperature != null) {
      setTargetTemp(entity.attributes.temperature);
    }
  }, [entity?.attributes?.temperature]);

  const currentTemp: number = entity?.attributes?.current_temperature ?? 0;

  const tempColorClass = useMemo(() => {
    if (currentTemp >= 25) return "text-red-500";
    if (currentTemp >= 20) return "text-orange-400";
    if (currentTemp >= 15) return "text-yellow-400";
    if (currentTemp >= 10) return "text-blue-400";
    return "text-blue-600";
  }, [currentTemp]);

  const statusInfo = useMemo(() => {
    const action = entity?.attributes?.hvac_action;
    if (action === "heating") return { text: "HEATING", color: "text-red-400" };
    if (action === "cooling") return { text: "COOLING", color: "text-blue-400" };
    return { text: "IDLE", color: "text-theme-text-muted" };
  }, [entity?.attributes?.hvac_action]);

  const difference = Math.abs(targetTemp - currentTemp);

  const adjustTemp = useCallback(
    (delta: number) => {
      setTargetTemp((prev) => {
        const newTemp = Math.round((prev + delta) * 2) / 2;
        if (connection && entityId) {
          connection.sendMessagePromise({
            type: "call_service",
            domain: "climate",
            service: "set_temperature",
            service_data: { entity_id: entityId, temperature: newTemp },
          });
        }
        return newTemp;
      });
    },
    [entityId, connection]
  );

  if (!entityId) {
    return (
      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
        <Icon path={mdiThermostat} className="h-10 w-10 mx-auto mb-2 opacity-40" />
        Configure Thermostat Entity
      </div>
    );
  }

  if (!entity || entity.state === "unavailable" || entity.state === "unknown") {
    return (
      <div className="w-full p-6 flex flex-col items-center justify-center bg-theme-surface border border-theme-error/50 text-theme-error rounded-2xl gap-2">
        <Icon path={mdiAlert} className="h-8 w-8" />
        <div className="text-center">
          <div className="text-sm font-medium">Thermostat Unavailable</div>
          <div className="text-xs opacity-70 break-all">{entityId}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 flex flex-col gap-5 text-theme-text bg-gradient-to-br-theme rounded-2xl shadow-card shadow-theme-surface">
      {/* Title */}
      <div className="text-sm font-semibold text-center leading-tight">
        {entity.attributes.friendly_name}
      </div>

      {/* Current Temperature */}
      <div className="text-center">
        <div className={classNames("text-5xl font-bold tracking-tight", tempColorClass)}>
          {currentTemp.toFixed(1)}°C
        </div>
        <div className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Current</div>
      </div>

      {/* Target Temperature Controls */}
      <div className="flex items-center justify-center gap-5">
        <button
          onClick={() => adjustTemp(-0.5)}
          className="h-10 w-10 rounded-full bg-theme-secondary hover:bg-theme-primary/60 transition-colors flex items-center justify-center shrink-0"
          aria-label="Decrease target temperature"
        >
          <Icon path={mdiMinus} className="h-5 w-5 text-theme-text" />
        </button>

        <div className="text-center min-w-[80px]">
          <div className="text-xl font-semibold">{targetTemp.toFixed(1)}°C</div>
          <div className="text-[10px] uppercase tracking-widest opacity-50">Target</div>
        </div>

        <button
          onClick={() => adjustTemp(0.5)}
          className="h-10 w-10 rounded-full bg-theme-secondary hover:bg-theme-primary/60 transition-colors flex items-center justify-center shrink-0"
          aria-label="Increase target temperature"
        >
          <Icon path={mdiPlus} className="h-5 w-5 text-theme-text" />
        </button>
      </div>

      {/* Status Row */}
      <div className="flex flex-row items-center justify-around border-t border-theme-border pt-4">
        <div className="flex flex-col items-center gap-1">
          <div className={classNames("text-sm font-semibold", statusInfo.color)}>
            {statusInfo.text}
          </div>
          <div className="text-[10px] uppercase tracking-widest opacity-50">Status</div>
        </div>

        <div className="w-px h-8 bg-theme-border" />

        <div className="flex flex-col items-center gap-1">
          <div className="text-sm font-semibold">{difference.toFixed(1)}°</div>
          <div className="text-[10px] uppercase tracking-widest opacity-50">Difference</div>
        </div>
      </div>
    </div>
  );
};
