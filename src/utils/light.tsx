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

// Icon mapping for better performance and maintainability
const ICON_MAP = {
  "mdi:track-light": mdiTrackLight,
  "mdi:led-strip": mdiLedStrip,
  "mdi:light-recessed": mdiLightRecessed,
  "mdi:lightbulb": mdiLightbulb,
  "mdi:diamond-stone": mdiDiamondStone,
  "mdi:ceiling-fan-light": mdiCeilingFanLight,
  "mdi:baby": mdiBaby,
  "mdi:bed": mdiBed,
  "mdi:stairs-up": mdiStairsUp,
} as const;

// State class mappings for consistency
const STATE_CLASSES = {
  on: "text-theme-primary",
  off: "text-theme-secondary",
  unavailable: "text-theme-error",
} as const;

const STATE_BG_CLASSES = {
  on: "bg-stone-800",
  off: "bg-stone-800", 
  unavailable: "bg-theme-error",
} as const;

export const renderIcon = (
  entity: HassEntityWithService<"light">,
  stateClassNameIcon: () => string
) => {
  const iconPath = ICON_MAP[entity.attributes.icon as keyof typeof ICON_MAP] || mdiLightbulb;
  
  return (
    <Icon
      path={iconPath}
      className={classNames("h-10 w-10", stateClassNameIcon())}
      aria-hidden="true"
    />
  );
};

export const stateClassNameBg = (entity: HassEntityWithService<"light">) => {
  return STATE_BG_CLASSES[entity.state as keyof typeof STATE_BG_CLASSES] || STATE_BG_CLASSES.unavailable;
};

export const stateClassNameIcon = (entity: HassEntityWithService<"light">) => {
  return STATE_CLASSES[entity.state as keyof typeof STATE_CLASSES] || STATE_CLASSES.unavailable;
};

// Brightness level configuration
const BRIGHTNESS_LEVELS = [
  { min: 0, max: 0, classes: "accent-theme-secondary text-theme-secondary", opacity: "" },
  { min: 1, max: 99, classes: "accent-theme-primary text-theme-primary", opacity: "opacity-50" },
  { min: 100, max: 199, classes: "accent-theme-primary text-theme-primary", opacity: "opacity-75" },
  { min: 200, max: Infinity, classes: "accent-theme-primary text-theme-primary", opacity: "" },
] as const;

export const sliderBrightnessClassnames = (
  entity: HassEntityWithService<"light">
) => {
  const brightness = entity.attributes.brightness;
  
  if (!brightness || entity.state === "off") {
    return "accent-theme-secondary text-theme-secondary";
  }

  const level = BRIGHTNESS_LEVELS.find(
    ({ min, max }) => brightness >= min && brightness <= max
  );
  
  return `${level?.classes || "accent-theme-secondary text-theme-secondary"} ${level?.opacity || ""}`.trim();
};

// Temperature level configuration  
const TEMPERATURE_LEVELS = [
  { factor: 0, classes: "accent-theme-primary text-theme-primary", opacity: "opacity-25" },
  { factor: 1, classes: "accent-theme-primary text-theme-primary", opacity: "opacity-50" },
  { factor: 2, classes: "accent-theme-primary text-theme-primary", opacity: "opacity-75" },
  { factor: 3, classes: "accent-theme-primary text-theme-primary", opacity: "opacity-90" },
  { factor: 4, classes: "accent-theme-primary text-theme-primary", opacity: "" },
] as const;

export const sliderTemperatureClassnames = (
  entity: HassEntityWithService<"light">,
  min: number,
  max: number,
  value: number
) => {
  if (entity.state === "off") return "text-theme-text-secondary";
  
  const range = max - min;
  const normalizedValue = value - min;
  const factor = Math.floor((normalizedValue / range) * 5);
  
  const level = TEMPERATURE_LEVELS.find(level => level.factor === Math.min(factor, 4));
  return `${level?.classes || "accent-theme-primary text-theme-primary"} ${level?.opacity || ""}`.trim();
};
