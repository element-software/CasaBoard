import { HassEntityWithService } from "@hakit/core";
import {
  mdiDoorClosed,
  mdiDoorOpen,
  mdiMotionSensor,
  mdiMotionSensorOff,
} from "@mdi/js";

// State class mappings for consistency
const STATE_BG_CLASSES = {
  on: "bg-stone-800",
  off: "bg-gray-800",
} as const;

const STATE_ICON_CLASSES = {
  on: "text-theme-primary",
  off: "text-theme-secondary",
} as const;

// Device class configurations
const DEVICE_CLASS_CONFIG = {
  occupancy: {
    icons: {
      on: { path: mdiMotionSensor, className: "h-10 w-10", color: "text-theme-primary" },
      off: { path: mdiMotionSensorOff, className: "h-10 w-10", color: "text-gray-400" },
      default: { path: mdiDoorOpen, className: "h-10 w-10", color: "text-red-500" },
    },
    states: {
      on: "Occupied",
      off: "Clear",
      default: "Unknown",
    },
  },
  door: {
    icons: {
      on: { path: mdiDoorOpen, className: "min-h-12 min-w-12 h-12 w-12", color: "text-theme-primary" },
      off: { path: mdiDoorClosed, className: "min-h-12 min-w-12 h-12 w-12", color: "text-gray-400" },
      default: { path: mdiDoorOpen, className: "h-12 w-12", color: "text-red-500" },
    },
    states: {
      on: "Open",
      off: "Closed", 
      default: "Unknown",
    },
  },
  running: {
    states: {
      on: "Running",
      off: "Not Running",
      default: "Unknown",
    },
  },
} as const;

export const stateClassNameBg = (
  entity: HassEntityWithService<"binarySensor">
) => {
  return STATE_BG_CLASSES[entity.state as keyof typeof STATE_BG_CLASSES] || "";
};

export const stateClassNameIcon = (
  entity: HassEntityWithService<"binarySensor">
) => {
  return STATE_ICON_CLASSES[entity.state as keyof typeof STATE_ICON_CLASSES] || STATE_ICON_CLASSES.on;
};

export const renderState = (entity: HassEntityWithService<"binarySensor">) => {
  const deviceClass = entity.attributes.device_class as keyof typeof DEVICE_CLASS_CONFIG;
  const config = DEVICE_CLASS_CONFIG[deviceClass]?.states;
  
  if (!config) return "Unknown";
  
  return config[entity.state as keyof typeof config] || config.default;
};
