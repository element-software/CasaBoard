import { HassEntityWithService } from "@hakit/core";
import {
  mdiTrackLight,
  mdiLightRecessed,
  mdiLightbulb,
  mdiDiamondStone,
  mdiCeilingFanLight,
  mdiBaby,
  mdiStairsUp,
  mdiBed,
} from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";

export const renderIcon = (
  entity: HassEntityWithService<"light">,
  stateClassNameIcon: () => string
) => {
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
    case "mdi:ceiling-fan-light":
      return (
        <Icon
          path={mdiCeilingFanLight}
          className={classNames("h-10 w-10", stateClassNameIcon())}
          aria-hidden="true"
        />
      );
    case "mdi:baby":
      return (
        <Icon
          path={mdiBaby}
          className={classNames("h-10 w-10", stateClassNameIcon())}
          aria-hidden="true"
        />
      );
    case "mdi:bed":
      return (
        <Icon
          path={mdiBed}
          className={classNames("h-10 w-10", stateClassNameIcon())}
          aria-hidden="true"
        />
      );
    case "mdi:stairs-up":
      return (
        <Icon
          path={mdiStairsUp}
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

export const stateClassNameBg = (entity: HassEntityWithService<"light">) => {
  switch (entity.state) {
    case "on":
      return "bg-stone-800";
    case "off":
      return "bg-stone-800";
    default:
      return "";
  }
};

export const stateClassNameIcon = (entity: HassEntityWithService<"light">) => {
  switch (entity.state) {
    case "on":
      return "text-amber-500";
    case "off":
      return "text-gray-400";
    default:
      return "text-amber-500";
  }
};

export const sliderBrightnessClassnames = (
  entity: HassEntityWithService<"light">
) => {
  if (entity.attributes.supported_color_modes?.includes("brightness") && entity.attributes.brightness) {
    return classNames({
      "accent-gray-400 text-gray-400": entity.attributes.brightness === 0 || entity.state === "off",
      "accent-amber-200 text-amber-200": entity.attributes.brightness > 0 && entity.attributes.brightness < 100,
      "accent-amber-300 text-amber-300": entity.attributes.brightness >= 100 && entity.attributes.brightness < 200,
      "accent-amber-400 text-amber-400": entity.attributes.brightness >= 200
    })
  }
  return "accent-gray-400 text-gray-400";
};

export const sliderTemperatureClassnames = (
  entity: HassEntityWithService<"light">,
  min: number,
  max: number,
  value: number
) => {
  if (entity.state === "off") return "accent-gray-400 text-gray-400";
  const fifth = (max - min) / 5;

  return classNames({
    "accent-amber-100 text-amber-100": value < min + fifth,
    "accent-amber-200 text-amber-200": value >= min + fifth && value < min + fifth * 2,
    "accent-amber-300 text-amber-300": value >= min + fifth * 2 && value < min + fifth * 3,
    "accent-amber-400 text-amber-400": value >= min + fifth * 3 && value < min + fifth * 4,
    "accent-amber-500 text-amber-500": value >= min + fifth * 4
  });
};
