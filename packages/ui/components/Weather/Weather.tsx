"use client";
import { useEntity, useHA } from "@repo/ha";
import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import {
  mdiWeatherNight,
  mdiWeatherSunny,
  mdiWeatherPartlyCloudy,
  mdiWeatherCloudy,
  mdiWeatherRainy,
  mdiWeatherPouring,
  mdiWeatherSnowy,
  mdiWeatherSnowyRainy,
  mdiWeatherWindy,
  mdiWeatherWindyVariant,
  mdiWeatherFog,
  mdiWeatherHail,
  mdiWeatherLightning,
  mdiWeatherLightningRainy,
  mdiWeatherSunnyAlert,
  mdiCloud,
} from "@mdi/js";
import classNames from "classnames";
import { Skeleton } from "@heroui/react";
import { useEntityLoading } from "@repo/hooks/useEntityLoading";

interface ForecastItem {
  datetime: string;
  condition: string;
  temperature: number;
  templow?: number;
}

const CONDITION_ICONS: Record<string, string> = {
  "clear-night": mdiWeatherNight,
  "sunny": mdiWeatherSunny,
  "partlycloudy": mdiWeatherPartlyCloudy,
  "cloudy": mdiWeatherCloudy,
  "rainy": mdiWeatherRainy,
  "pouring": mdiWeatherPouring,
  "snowy": mdiWeatherSnowy,
  "snowy-rainy": mdiWeatherSnowyRainy,
  "windy": mdiWeatherWindy,
  "windy-variant": mdiWeatherWindyVariant,
  "fog": mdiWeatherFog,
  "hail": mdiWeatherHail,
  "lightning": mdiWeatherLightning,
  "lightning-rainy": mdiWeatherLightningRainy,
  "exceptional": mdiWeatherSunnyAlert,
};

function getWeatherIcon(condition: string): string {
  return CONDITION_ICONS[condition] ?? mdiCloud;
}

function formatCondition(condition: string): string {
  return condition
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
}

function formatForecastDay(datetime: string): string {
  const date = new Date(datetime);
  return date.toLocaleDateString("en-GB", { weekday: "short" });
}

function formatForecastTime(datetime: string): string {
  const date = new Date(datetime);
  return date.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase();
}

interface WeatherProps {
  entityId: string;
  forecastType?: "daily" | "hourly";
  forecastCount?: number;
}

export const Weather = ({
  entityId,
  forecastType = "daily",
  forecastCount = 4,
}: WeatherProps) => {
  const entity = useEntity(entityId);
  const { connection } = useHA();
  const { isEntityReady, showNotAvailable, isLoaded } = useEntityLoading(entity);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);

  useEffect(() => {
    if (!connection || !entityId) return;

    let cancelled = false;

    connection
      .sendMessagePromise({
        type: "call_service",
        domain: "weather",
        service: "get_forecasts",
        target: { entity_id: entityId },
        service_data: { type: forecastType },
        return_response: true,
      } as any)
      .then((result: any) => {
        if (cancelled) return;
        const data = result?.response?.[entityId]?.forecast;
        if (Array.isArray(data) && data.length > 0) {
          setForecast(data);
        }
      })
      .catch(() => {
        // Fallback to legacy forecast attribute
        if (!cancelled && Array.isArray(entity?.attributes?.forecast)) {
          setForecast(entity.attributes.forecast);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [connection, entityId, forecastType]);

  // Also pick up attribute forecast when service call is not available
  useEffect(() => {
    if (forecast.length === 0 && Array.isArray(entity?.attributes?.forecast)) {
      setForecast(entity.attributes.forecast);
    }
  }, [entity?.attributes?.forecast, forecast.length]);

  if (!entityId) {
    return (
      <div className="p-4 border-2 border-dashed border-theme-border rounded-lg text-center text-theme-text-muted">
        <Icon path={mdiCloud} className="h-10 w-10 mx-auto mb-2 opacity-40" />
        Configure Weather Entity
      </div>
    );
  }

  const condition = isEntityReady ? entity!.state : "";
  const currentTemp: number = entity?.attributes?.temperature ?? 0;
  const conditionIcon = getWeatherIcon(condition);
  const visibleForecast = forecast.slice(0, forecastCount);

  return (
    <Skeleton isLoaded={isLoaded} className="w-full rounded-2xl">
      {showNotAvailable ? (
        <div className="w-full p-4 flex items-center gap-3 bg-theme-surface border border-theme-border rounded-2xl opacity-50">
          <Icon path={mdiCloud} className="h-8 w-8 flex-shrink-0 text-theme-text-muted" />
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-semibold text-theme-text-muted truncate">{entityId}</p>
            <p className="text-xs text-theme-text-muted">Unavailable</p>
          </div>
        </div>
      ) : isEntityReady ? (
        <div className="w-full p-6 flex flex-col gap-4 text-theme-text bg-gradient-to-br-theme rounded-2xl shadow-card shadow-theme-surface">
          {/* Current Conditions */}
          <div className="flex items-center gap-3">
            <Icon
              path={conditionIcon}
              className="h-10 w-10 text-theme-primary shrink-0"
              aria-hidden="true"
            />
            <div>
              <div className="text-xl font-semibold">
                {currentTemp.toFixed(1)}°,{" "}
                <span className="text-theme-text-secondary font-normal">
                  {formatCondition(condition)}
                </span>
              </div>
              {entity!.attributes?.friendly_name && (
                <div className="text-xs text-theme-text-muted">
                  {entity!.attributes.friendly_name}
                </div>
              )}
            </div>
          </div>

          {/* Forecast Grid */}
          {visibleForecast.length > 0 && (
            <div
              className={classNames("grid gap-2 border-t border-theme-border pt-4", {
                "grid-cols-2": forecastCount === 2,
                "grid-cols-3": forecastCount === 3,
                "grid-cols-4": forecastCount === 4,
                "grid-cols-5": forecastCount >= 5,
              })}
            >
              {visibleForecast.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1 text-center">
                  <div className="text-xs font-medium text-theme-text-secondary">
                    {formatForecastDay(item.datetime)}
                  </div>
                  <div className="text-[10px] text-theme-text-muted">
                    {formatForecastTime(item.datetime)}
                  </div>
                  <Icon
                    path={getWeatherIcon(item.condition)}
                    className="h-6 w-6 text-theme-primary"
                    aria-hidden="true"
                  />
                  <div className="text-xs font-semibold">{item.temperature.toFixed(1)}°</div>
                  {item.templow != null && (
                    <div className="text-[10px] text-theme-text-muted">
                      {item.templow.toFixed(1)}°
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl p-3 opacity-0" />
      )}
    </Skeleton>
  );
};
