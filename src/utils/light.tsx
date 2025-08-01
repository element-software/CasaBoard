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
  mdiLedStrip,
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
    case "mdi:led-strip":
      return (
        <Icon
          path={mdiLedStrip}
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
      return "text-theme-text-primary";
    case "off":
      return "text-theme-text-text-theme-text-secondary";
    default:
      return "text-theme-text-primary";
  }
};

export const sliderBrightnessClassnames = (
  entity: HassEntityWithService<"light">
) => {
  if (entity.attributes.brightness) {
    // Use different opacity levels to distinguish brightness levels
    if (entity.attributes.brightness === 0 || entity.state === "off") {
      return "accent-theme-accent-secondary text-theme-text-secondary";
    } else if (entity.attributes.brightness > 0 && entity.attributes.brightness < 100) {
      return "accent-theme-accent-primary text-theme-text-primary opacity-50";
    } else if (entity.attributes.brightness >= 100 && entity.attributes.brightness < 200) {
      return "accent-theme-accent-primary text-theme-text-primary opacity-75";
    } else {
      return "accent-theme-accent-primary text-theme-text-primary";
    }
  }
  return "accent-theme-accent-secondary text-theme-text-secondary";
};

export const sliderTemperatureClassnames = (
  entity: HassEntityWithService<"light">,
  min: number,
  max: number,
  value: number
) => {
  if (entity.state === "off") return "text-theme-text-theme-text-secondary";
  const fifth = (max - min) / 5;

  // Use different opacity levels to distinguish temperature levels
  if (value < min + fifth) {
    return "accent-theme-accent-primary text-theme-text-primary opacity-25";
  } else if (value >= min + fifth && value < min + fifth * 2) {
    return "accent-theme-accent-primary text-theme-text-primary opacity-50";
  } else if (value >= min + fifth * 2 && value < min + fifth * 3) {
    return "accent-theme-accent-primary text-theme-text-primary opacity-75";
  } else if (value >= min + fifth * 3 && value < min + fifth * 4) {
    return "accent-theme-accent-primary text-theme-text-primary opacity-90";
  } else {
    return "accent-theme-accent-primary text-theme-text-primary";
  }
};
