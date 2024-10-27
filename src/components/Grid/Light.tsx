"use client";
import { EntityName, useEntity, useHass } from "@hakit/core";
import classNames from "classnames";
import { useCallback } from "react";
import Toggle from "../Toggle";
import Icon from "@mdi/react";
import { mdiPalette, mdiThermometer, mdiWeatherSunny } from "@mdi/js";
import { HuePicker } from "react-color";
import { LightUtils } from "@/utils";

interface LightProps {
  entityId: EntityName;
  dimmer?: boolean;
  temperature?: boolean;
  color?: boolean;
}

export const Light = ({
  entityId,
  dimmer = false,
  temperature = false,
  color = false,
}: LightProps) => {
  const entity = useEntity(entityId);

  const { callService } = useHass();

  const handleTurnOn = useCallback(
    (entityId: EntityName) => {
      callService({
        domain: "light",
        service: "turn_on",
        target: {
          entity_id: entityId,
        },
      });
    },
    [callService]
  );

  const setBrightness = useCallback(
    (value: string, entityId: EntityName) => {
      callService({
        domain: "light",
        service: "turn_on",
        target: {
          entity_id: entityId,
        },
        serviceData: {
          brightness: Number(value),
        },
      });
    },
    [callService]
  );

  const setTemperature = useCallback(
    (value: string, entityId: EntityName) => {
      callService({
        domain: "light",
        service: "turn_on",
        target: {
          entity_id: entityId,
        },
        serviceData: {
          // @ts-ignore
          color_temp_kelvin: Number(value),
        },
      });
    },
    [callService]
  );

  const setColor = useCallback(
    (value: string, entityId: EntityName) => {
      callService({
        domain: "light",
        service: "turn_on",
        target: {
          entity_id: entityId,
        },
        serviceData: {
          // @ts-ignore
          rgb_color: [
            value.substring(1, 3),
            value.substring(3, 5),
            value.substring(5, 7),
          ].map((x) => parseInt(x, 16)),
        },
      });
    },
    [callService]
  );

  const handleTurnOff = useCallback(
    (entityId: EntityName) => {
      callService({
        domain: "light",
        service: "turn_off",
        target: {
          entity_id: entityId,
        },
      });
    },
    [callService]
  );

  const handleToggle = useCallback(
    (entityId: EntityName) => {
      callService({
        domain: "light",
        service: "toggle",
        target: {
          entity_id: entityId,
        },
      });
    },
    [callService]
  );

  if (!entity) return null;

  return (
    <div
      key={entity.entity_id}
      className={classNames(
        "z-0 relative overflow-hidden w-full flex space-y-2 flex-col items-center justify-between p-6 cursor-pointer bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-card shadow-neutral-800",
        {
          "h-40": !dimmer && !temperature && !color,
          "h-44": dimmer || temperature || color,
          "h-48":
            (dimmer && temperature) ||
            (dimmer && color) ||
            (temperature && color),
          "h-64": dimmer && temperature && color,
        },
        LightUtils.stateClassNameBg(entity)
      )}
    >
      <div
        className="flex flex-row w-full items-center justify-between"
        onClick={() => handleToggle(entity.entity_id as EntityName)}
      >
        {LightUtils.renderIcon(entity, () =>
          LightUtils.stateClassNameIcon(entity)
        )}
        <Toggle
          enabled={entity.state === "on" ? true : false}
          onToggle={() =>
            entity.state === "on"
              ? handleTurnOff(entity.entity_id as EntityName)
              : handleTurnOn(entity.entity_id as EntityName)
          }
        />
      </div>
      {dimmer &&
        entity?.attributes.supported_color_modes?.includes("brightness") && (
          <div className="flex flex-row gap-2 w-full items-center">
            <Icon
              path={mdiWeatherSunny}
              className={classNames(
                "h-8 w-8",
                LightUtils.sliderBrightnessClassnames(entity) 
              )}
              aria-hidden="true"
            />
            <input
              type="range"
              min="0"
              max="250"
              step="25"
              defaultValue={entity.attributes.brightness || 0}
              className={classNames(
                "w-full mt-0",
                LightUtils.sliderBrightnessClassnames(entity)
              )}
              onChange={(e: any) =>
                setBrightness(e.target.value, entity.entity_id as EntityName)
              }
            />
          </div>
        )}

      {temperature &&
        entity?.attributes.supported_color_modes?.includes("color_temp") && (
          <div className="flex flex-row gap-2 w-full items-center">
            <Icon
              path={mdiThermometer}
              className={classNames(
                "h-8 w-8",
                LightUtils.sliderTemperatureClassnames(
                  entity,
                  entity.attributes.min_color_temp_kelvin,
                  entity.attributes.max_color_temp_kelvin,
                  entity.attributes.color_temp_kelvin
                )
              )}
              aria-hidden="true"
            />
            <input
              type="range"
              min={entity.attributes.min_color_temp_kelvin || 0}
              max={entity.attributes.max_color_temp_kelvin || 100}
              step="250"
              defaultValue={entity.attributes.color_temp_kelvin || 0}
              className={classNames(
                "w-full",
                LightUtils.sliderTemperatureClassnames(
                  entity,
                  entity.attributes.min_color_temp_kelvin,
                  entity.attributes.max_color_temp_kelvin,
                  entity.attributes.color_temp_kelvin
                )
              )}
              onTouchEnd={(e: any) =>
                setTemperature(e.target.value, entity.entity_id as EntityName)
              }
            />
          </div>
        )}

      {color && entity?.attributes.supported_color_modes?.includes("xy") && (
        <div className="flex flex-row gap-2 w-full items-center">
          <Icon
            path={mdiPalette}
            className={classNames(
              "h-8 w-8",
              LightUtils.sliderTemperatureClassnames(
                entity,
                entity.attributes.min_color_temp_kelvin,
                entity.attributes.max_color_temp_kelvin,
                entity.attributes.color_temp_kelvin
              )
            )}
            aria-hidden="true"
          />
          <HuePicker
            className={classNames("w-full max-w-56 overflow-hidden", {
              grayscale: entity.state === "off",
            })}
            color={entity.custom.hexColor}
            onChange={(color) => {
              setColor(color.hex, entity.entity_id as EntityName);
            }}
          />
        </div>
      )}

      <h3 className="w-full text-base capitalize text-white">
        {entity.attributes.friendly_name}
      </h3>
    </div>
  );
};
