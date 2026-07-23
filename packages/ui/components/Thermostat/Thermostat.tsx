"use client";
import { useEntity, useHA } from "@repo/ha";
import { mdiPlus, mdiMinus, mdiThermostat } from "@mdi/js";
import Icon from "@mdi/react";
import { useCallback, useMemo, useState, useEffect } from "react";
import { Skeleton } from "@heroui/react";
import { useEntityLoading } from "@repo/hooks/useEntityLoading";

export type ThermostatOrientation = "horizontal" | "vertical";

interface ThermostatProps {
  entityId: string;
  /** Compact row for sidebars; stacked layout for main grids. */
  orientation?: ThermostatOrientation;
}

function formatModeLabel(entity: any): string {
  const action = entity?.attributes?.hvac_action as string | undefined;
  const mode = (entity?.state || entity?.attributes?.hvac_mode || "") as string;

  if (action === "heating" || mode === "heat") return "Heat";
  if (action === "cooling" || mode === "cool") return "Cool";
  if (action === "drying" || mode === "dry") return "Dry";
  if (action === "fan" || mode === "fan_only") return "Fan";
  if (mode === "heat_cool" || mode === "auto") return "Auto";
  if (mode === "off") return "Off";
  if (action === "idle") {
    if (mode === "heat") return "Heat";
    if (mode === "cool") return "Cool";
    return "Idle";
  }
  if (!mode) return "Climate";
  return mode
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatTemp(value: number | null | undefined): string | null {
  if (value == null || Number.isNaN(Number(value))) return null;
  const n = Number(value);
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export const Thermostat = ({
  entityId,
  orientation = "horizontal",
}: ThermostatProps) => {
  const entity = useEntity(entityId);
  const { connection } = useHA();
  const { isEntityReady, showNotAvailable, isLoaded } = useEntityLoading(entity);
  const [targetTemp, setTargetTemp] = useState<number>(0);
  const orientationClass =
    orientation === "vertical" ? "thermostat-hk--vertical" : "thermostat-hk--horizontal";

  useEffect(() => {
    if (entity?.attributes?.temperature != null) {
      setTargetTemp(entity.attributes.temperature);
    }
  }, [entity?.attributes?.temperature]);

  const modeLabel = useMemo(
    () => (isEntityReady ? formatModeLabel(entity) : ""),
    [entity, isEntityReady]
  );

  const currentTempLabel = useMemo(
    () => formatTemp(entity?.attributes?.current_temperature),
    [entity?.attributes?.current_temperature]
  );

  const targetTempLabel = useMemo(() => {
    const t =
      targetTemp ||
      entity?.attributes?.temperature ||
      null;
    return formatTemp(t);
  }, [targetTemp, entity?.attributes?.temperature]);

  const adjustTemp = useCallback(
    (delta: number) => {
      setTargetTemp((prev) => {
        const base =
          prev ||
          entity?.attributes?.temperature ||
          entity?.attributes?.current_temperature ||
          20;
        const newTemp = Math.round((base + delta) * 2) / 2;
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
    [entityId, connection, entity?.attributes?.temperature, entity?.attributes?.current_temperature]
  );

  if (!entityId) {
    return (
      <div className={`thermostat-hk ${orientationClass} thermostat-hk--empty`}>
        <Icon path={mdiThermostat} className="h-8 w-8 opacity-40" />
        <span>Configure Thermostat Entity</span>
      </div>
    );
  }

  return (
    <Skeleton
      isLoaded={isLoaded}
      className="flex h-full w-full flex-col rounded-[1.75rem]"
      classNames={{ content: "flex h-full min-h-0 w-full flex-1 flex-col" }}
    >
      {showNotAvailable ? (
        <div className={`thermostat-hk ${orientationClass} thermostat-hk--unavailable`}>
          <div className="thermostat-hk__icon" aria-hidden>
            <Icon path={mdiThermostat} className="h-6 w-6" />
          </div>
          <div className="thermostat-hk__labels">
            <div className="thermostat-hk__title">{entityId}</div>
            <div className="thermostat-hk__status">Unavailable</div>
          </div>
        </div>
      ) : isEntityReady ? (
        <div className={`thermostat-hk ${orientationClass}`}>
          <div className="thermostat-hk__icon" aria-hidden>
            {/* Concentric ring mark matching HomeKit climate glyph */}
            <span className="thermostat-hk__ring" />
          </div>

          <div className="thermostat-hk__labels">
            <div className="thermostat-hk__title">
              {entity.attributes?.friendly_name || "Thermostat"}
            </div>
            <div className="thermostat-hk__status">{modeLabel}</div>
            {(currentTempLabel != null || targetTempLabel != null) && (
              <div className="thermostat-hk__temps">
                {currentTempLabel != null && (
                  <span className="thermostat-hk__temp">
                    <span className="thermostat-hk__temp-label">Now</span>
                    {currentTempLabel}°
                  </span>
                )}
                {currentTempLabel != null && targetTempLabel != null && (
                  <span className="thermostat-hk__temp-sep" aria-hidden>
                    ·
                  </span>
                )}
                {targetTempLabel != null && (
                  <span className="thermostat-hk__temp thermostat-hk__temp--target">
                    <span className="thermostat-hk__temp-label">Set</span>
                    {targetTempLabel}°
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="thermostat-hk__controls">
            {orientation === "vertical" ? (
              <>
                <button
                  type="button"
                  className="thermostat-hk__btn"
                  onClick={() => adjustTemp(-0.5)}
                  aria-label="Decrease target temperature"
                >
                  <Icon path={mdiMinus} className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="thermostat-hk__btn"
                  onClick={() => adjustTemp(0.5)}
                  aria-label="Increase target temperature"
                >
                  <Icon path={mdiPlus} className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="thermostat-hk__btn"
                  onClick={() => adjustTemp(0.5)}
                  aria-label="Increase target temperature"
                >
                  <Icon path={mdiPlus} className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="thermostat-hk__btn"
                  onClick={() => adjustTemp(-0.5)}
                  aria-label="Decrease target temperature"
                >
                  <Icon path={mdiMinus} className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className={`thermostat-hk ${orientationClass} opacity-0`} />
      )}
    </Skeleton>
  );
};
