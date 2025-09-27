import { mdiShieldLock, mdiShieldLockOpen, mdiShieldAlert } from "@mdi/js";

// State class mappings for consistency
const STATE_BG_CLASSES = {
  disarmed: "bg-gray-800",
  armed_night: "bg-stone-800",
} as const;

// Alarm state configuration
const ALARM_STATE_CONFIG = {
  armed_night: {
    icon: { path: mdiShieldLock, className: "h-12 w-12", color: "text-theme-primary" },
  },
  disarmed: {
    icon: { path: mdiShieldLockOpen, className: "h-12 w-12", color: "text-gray-400" },
  },
  default: {
    icon: { path: mdiShieldAlert, className: "h-12 w-12", color: "text-red-500" },
  },
} as const;

export const stateClassNameBg = (
  entity: any
) => {
  return STATE_BG_CLASSES[entity.state as keyof typeof STATE_BG_CLASSES] || "";
};
