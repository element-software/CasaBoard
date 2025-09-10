// Theme utility functions for components
// Provides consistent theming across all components

import { ThemeConfig, IThemeConfig } from "@repo/config";

// Entity state utilities
export const getEntityStateColor = (state: string, theme: IThemeConfig): string => {
  switch (state) {
    case "on":
      return theme.colors.entity.on;
    case "off":
      return theme.colors.entity.off;
    case "unavailable":
      return theme.colors.entity.unavailable;
    case "unknown":
      return theme.colors.entity.unknown;
    default:
      return theme.colors.entity.off;
  }
};

export const getEntityStateVariant = (state: string): "success" | "default" | "danger" | "warning" => {
  switch (state) {
    case "on":
      return "success";
    case "off":
      return "default";
    case "unavailable":
      return "danger";
    case "unknown":
      return "warning";
    default:
      return "default";
  }
};

// Card utilities
export const getCardStyles = (theme: IThemeConfig, state?: string) => {
  const baseStyles = {
    backgroundColor: theme.colors.card.background,
    borderColor: theme.colors.card.border,
    color: theme.colors.text,
  };

  if (state) {
    const stateColor = getEntityStateColor(state, theme);
    return {
      ...baseStyles,
      borderColor: stateColor,
      borderLeftColor: stateColor,
      borderLeftWidth: "4px",
    };
  }

  return baseStyles;
};

// Button utilities
export const getButtonColor = (variant: "primary" | "secondary" | "success" | "warning" | "error", theme: IThemeConfig): string => {
  return theme.colors.button[variant];
};

// Slider utilities
export const getSliderStyles = (theme: IThemeConfig, state?: string) => {
  const stateColor = state ? getEntityStateColor(state, theme) : theme.colors.primary;
  
  return {
    trackColor: theme.colors.slider.track,
    thumbColor: stateColor,
    activeColor: stateColor,
  };
};

// Text utilities
export const getTextColor = (variant: "primary" | "secondary", theme: IThemeConfig): string => {
  return variant === "primary" ? theme.colors.text : theme.colors.textSecondary;
};

// Background utilities
export const getBackgroundColor = (variant: "background" | "surface", theme: IThemeConfig): string => {
  return variant === "background" ? theme.colors.background : theme.colors.surface;
};

// Border utilities
export const getBorderColor = (theme: IThemeConfig, state?: string): string => {
  if (state) {
    return getEntityStateColor(state, theme);
  }
  return theme.colors.border;
};

// Chip utilities
export const getChipColor = (state: string): "success" | "default" | "danger" | "warning" | "primary" => {
  switch (state) {
    case "on":
      return "success";
    case "off":
      return "default";
    case "unavailable":
      return "danger";
    case "unknown":
      return "warning";
    default:
      return "primary";
  }
};

// Icon utilities
export const getIconColor = (state: string, theme: IThemeConfig): string => {
  return getEntityStateColor(state, theme);
};

// Gradient utilities
export const getGradientStyles = (theme: IThemeConfig, state?: string) => {
  if (state && state === "on") {
    const stateColor = getEntityStateColor(state, theme);
    return {
      background: `linear-gradient(135deg, ${stateColor}20, ${theme.colors.card.background})`,
    };
  }
  
  return {
    background: `linear-gradient(135deg, ${theme.colors.card.background}, ${theme.colors.surface})`,
  };
};

// Shadow utilities
export const getShadowStyles = (theme: IThemeConfig, state?: string) => {
  const baseShadow = theme.isDark 
    ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
    : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
  
  if (state && state === "on") {
    const stateColor = getEntityStateColor(state, theme);
    return {
      boxShadow: `${baseShadow}, 0 0 0 1px ${stateColor}40`,
    };
  }
  
  return {
    boxShadow: baseShadow,
  };
};

// Hover utilities
export const getHoverStyles = (theme: IThemeConfig, state?: string) => {
  const baseHover = {
    backgroundColor: theme.colors.card.hover,
  };
  
  if (state && state === "on") {
    const stateColor = getEntityStateColor(state, theme);
    return {
      ...baseHover,
      borderColor: stateColor,
    };
  }
  
  return baseHover;
};
