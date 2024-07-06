"use client";
import {
  EntityName,
  useEntity,
  useHass,
} from "@hakit/core";
import classNames from "classnames";
import { useCallback } from "react";
import Toggle from "../Toggle";
import Icon from "@mdi/react";
import {
  mdiDiamondStone,
  mdiLightRecessed,
  mdiLightbulb,
  mdiPalette,
  mdiThermometer,
  mdiTrackLight,
  mdiWeatherSunny,
} from "@mdi/js";
import { HuePicker } from "react-color";

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

  console.log("Light:: entity", entity?.attributes.friendly_name, " supports", entity?.attributes.supported_features, entity?.attributes.supported_color_modes)

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

  const stateClassNameBg = () => {
    switch (entity.state) {
      case "on":
        return "bg-stone-800";
      case "off":
        return "bg-stone-800";
      default:
        return "";
    }
  };

  const stateClassNameIcon = () => {
    switch (entity.state) {
      case "on":
        return "text-amber-500";
      case "off":
        return "text-gray-400";
      default:
        return "text-amber-500";
    }
  };

  const sliderBrightnessClassnames = () => {
    if (entity.attributes.brightness < 10 || entity.state === "off") {
      return "accent-gray-400 text-gray-400";
    } else {
      // return accent colour relative to brightness
      if (
        entity.attributes.brightness >= 10 &&
        entity.attributes.brightness < 100
      ) {
        return "accent-amber-600 text-amber-600";
      } else if (
        entity.attributes.brightness >= 150 &&
        entity.attributes.brightness < 200
      ) {
        return "accent-amber-500 text-amber-500";
      } else if (
        entity.attributes.brightness >= 200 &&
        entity.attributes.brightness < 250
      ) {
        return "accent-amber-400 text-amber-400";
      } else {
        return "accent-amber-500 text-amber-500";
      }
    }
  };

  const sliderTemperatureClassnames = (
    min: number,
    max: number,
    value: number
  ) => {
    if (entity.state === "off") return "accent-gray-400 text-gray-400";
    const fifth = (max - min) / 5;
    if (value < min + fifth) {
      return "accent-amber-500 text-amber-500";
    } else if (value >= min + fifth && value < min + fifth * 2) {
      return "accent-amber-400 text-amber-400";
    } else if (value >= min + fifth * 2 && value < min + fifth * 3) {
      return "accent-amber-300 text-amber-300";
    } else if (value >= min + fifth * 3 && value < min + fifth * 4) {
      return "accent-amber-200 text-amber-200";
    } else {
      return "accent-amber-100 text-amber-100";
    }
  };

  const renderIcon = () => {
    switch (entity.attributes.icon) {
      case "mdi:track-light":
        return (
          <Icon
            path={mdiTrackLight}
            className={classNames("h-10 w-10", stateClassNameIcon())}
            aria-hidden="true"
          />
        );
      case "mdi:light-recessed":
        return (
          <Icon
            path={mdiLightRecessed}
            className={classNames("h-10 w-10", stateClassNameIcon())}
            aria-hidden="true"
          />
        );
      case "mdi:lightbulb":
        return (
          <Icon
            path={mdiLightbulb}
            className={classNames("h-10 w-10", stateClassNameIcon())}
            aria-hidden="true"
          />
        );
      case "mdi:diamond-stone":
        return (
          <Icon
            path={mdiDiamondStone}
            className={classNames("h-10 w-10", stateClassNameIcon())}
            aria-hidden="true"
          />
        );
      default:
        return (
          <Icon
            path={mdiLightbulb}
            className={classNames("h-10 w-10", stateClassNameIcon())}
            aria-hidden="true"
          />
        );
    }
  };

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
        stateClassNameBg()
      )}
    >
      <div
        className="flex flex-row w-full items-center justify-between"
        onClick={() => handleToggle(entity.entity_id as EntityName)}
      >
        {renderIcon()}
        <Toggle
          enabled={entity.state === "on" ? true : false}
          onToggle={() =>
            entity.state === "on"
              ? handleTurnOff(entity.entity_id as EntityName)
              : handleTurnOn(entity.entity_id as EntityName)
          }
        />
      </div>
      {dimmer && entity?.attributes.supported_color_modes?.includes("brightness") && (
        <div className="flex flex-row gap-2 w-full items-center">
          <Icon
            path={mdiWeatherSunny}
            className={classNames("h-8 w-8", sliderBrightnessClassnames())}
            aria-hidden="true"
          />
          <input
            type="range"
            min="0"
            max="250"
            step="25"
            defaultValue={entity.attributes.brightness || 0}
            className={classNames("w-full mt-0", sliderBrightnessClassnames())}
            onChange={(e: any) =>
              setBrightness(e.target.value, entity.entity_id as EntityName)
            }
          />
        </div>
      )}

      {temperature && entity?.attributes.supported_color_modes?.includes("color_temp") && (
        <div className="flex flex-row gap-2 w-full items-center">
          <Icon
            path={mdiThermometer}
            className={classNames(
              "h-8 w-8",
              sliderTemperatureClassnames(
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
              sliderTemperatureClassnames(
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
              sliderTemperatureClassnames(
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
