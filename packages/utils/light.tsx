const STATE_CLASSES = {
  on: "text-white",
  off: "text-secondary",
  unavailable: "text-theme-error",
} as const;

const STATE_BG_CLASSES = {
  on: "bg-primary",
  off: "bg-background",
  unavailable: "bg-theme-error",
} as const;

export const stateClassNameBg = (entity: any) => {
  // Removed debugging log statement
  return (
    STATE_BG_CLASSES[entity.state as keyof typeof STATE_BG_CLASSES] ||
    STATE_BG_CLASSES.unavailable
  );
};

export const stateClassNameIcon = (entity: any) => {
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
  entity: any
) => {
  const brightness = entity.attributes.brightness;

  // Off: no highlight
  if (entity.state === "off") return "text-theme-text-secondary";

  // No dimmer: fill fully with primary and ensure white text contrast
  if (!brightness && brightness !== 0) {
    return "bg-theme-primary text-white";
  }

  const level = BRIGHTNESS_LEVELS.find(({ min, max }) => brightness >= min && brightness <= max);
  return `${level?.classes || "accent-theme-primary text-theme-primary"} ${level?.opacity || ""}`.trim();
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
  entity: any,
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
