"use client";
import { EntityName, useEntity, useHass } from "@hakit/core";
import classNames from "classnames";
import { useCallback } from "react";
import Toggle from "../Toggle";
import Icon from "@mdi/react";
import {
  mdiDiamondStone,
  mdiLightRecessed,
  mdiLightbulb,
  mdiTrackLight,
} from "@mdi/js";

interface LightProps {
  entityId: EntityName;
  dimmer?: boolean;
}

export const Light = ({ entityId, dimmer = false }: LightProps) => {
  const entity = useEntity(entityId);
  const { callService } = useHass();
  console.log("Light:: entity", entity);

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

  const sliderClassnames = () => {
    if (entity.attributes.brightness < 10) {
      return "accent-gray-400";
    } else {
      // return accent colour relative to brightness
      if (entity.attributes.brightness >= 10 && entity.attributes.brightness < 100) {
        return "accent-amber-600";
      } else if (entity.attributes.brightness >= 150 && entity.attributes.brightness < 200) {
        return "accent-amber-500";
      } else if (entity.attributes.brightness >= 200 && entity.attributes.brightness < 250) {
        return "accent-amber-400";
      } else {
        return "accent-amber-500";
      }
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

  return (
    <div
      key={entity.entity_id}
      className={classNames(
        "relative overflow-hidden w-full flex flex-col items-center justify-between space-y-2 p-6 h-40 cursor-pointer  bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-card shadow-neutral-800",
        stateClassNameBg()
      )}
      onClick={() => handleToggle(entity.entity_id as EntityName)}
    >
      <div className="flex flex-row w-full items-center justify-between">
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
      {dimmer && (
        <input
          type="range"
          min="0"
          max="250"
          step="25"
          defaultValue={entity.attributes.brightness}
          className={classNames("w-full", sliderClassnames())}
          onChange={(e: any) => {
            console.log("Light:: input: brightness", e.target.value);
            callService({
              domain: "light",
              service: "turn_on",
              target: {
                entity_id: entityId,
              },
              serviceData: {
                brightness: Number(e.target.value),
              },
            });
          }}
        />
      )}

      <h3 className="w-full text-base capitalize text-white">
        {entity.attributes.friendly_name}
      </h3>
    </div>
  );
};
