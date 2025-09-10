// Custom hook for theme access
import { useContext } from "react";
import { ThemeContext } from "@repo/ui/components/ThemeSwitch/ThemeProvider";
import { ThemeConfig } from "@repo/config";
import { ThemeUtils } from "@repo/utils";

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  const { currentTheme } = context;
  const theme = ThemeConfig.getTheme(currentTheme);
  
  return {
    ...context,
    theme,
    isDark: theme.isDark,
    colors: theme.colors,
  };
};

// Hook for component-specific theme utilities
export const useComponentTheme = () => {
  const { theme } = useTheme();
  
  return {
    // Entity state utilities
    getEntityStateColor: (state: string) => {
      return ThemeUtils.getEntityStateColor(state, theme);
    },
    
    getEntityStateVariant: (state: string): "success" | "default" | "danger" | "warning" => {
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
    },
    
    // Card utilities
    getCardStyles: (state?: string) => {
      const baseStyles = {
        backgroundColor: theme.colors.card.background,
        borderColor: theme.colors.card.border,
        color: theme.colors.text,
      };

      if (state) {
        const stateColor = ThemeUtils.getEntityStateColor(state, theme);
        return {
          ...baseStyles,
          borderColor: stateColor,
          borderLeftColor: stateColor,
          borderLeftWidth: "4px",
        };
      }

      return baseStyles;
    },
    
    // Button utilities
    getButtonColor: (variant: "primary" | "secondary" | "success" | "warning" | "error") => {
      return theme.colors.button[variant];
    },
    
    // Slider utilities
    getSliderStyles: (state?: string) => {
      const stateColor = state ? ThemeUtils.getEntityStateColor(state, theme) : theme.colors.primary;
      
      return {
        trackColor: theme.colors.slider.track,
        thumbColor: stateColor,
        activeColor: stateColor,
      };
    },
    
    // Text utilities
    getTextColor: (variant: "primary" | "secondary") => {
      return variant === "primary" ? theme.colors.text : theme.colors.textSecondary;
    },
    
    // Background utilities
    getBackgroundColor: (variant: "background" | "surface") => {
      return variant === "background" ? theme.colors.background : theme.colors.surface;
    },
    
    // Border utilities
    getBorderColor: (state?: string) => {
      if (state) {
        return ThemeUtils.getEntityStateColor(state, theme);
      }
      return theme.colors.border;
    },
    
    // Chip utilities
    getChipColor: (state: string): "success" | "default" | "danger" | "warning" | "primary" => {
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
    },
    
    // Icon utilities
    getIconColor: (state: string) => {
      return ThemeUtils.getEntityStateColor(state, theme);
    },
    
    // Gradient utilities
    getGradientStyles: (state?: string) => {
      if (state && state === "on") {
        const stateColor = ThemeUtils.getEntityStateColor(state, theme);
        return {
          background: `linear-gradient(135deg, ${stateColor}20, ${theme.colors.card.background})`,
        };
      }
      
      return {
        background: `linear-gradient(135deg, ${theme.colors.card.background}, ${theme.colors.surface})`,
      };
    },
    
    // Shadow utilities
    getShadowStyles: (state?: string) => {
      const baseShadow = theme.isDark 
        ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
        : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
      
      if (state && state === "on") {
        const stateColor = ThemeUtils.getEntityStateColor(state, theme);
        return {
          boxShadow: `${baseShadow}, 0 0 0 1px ${stateColor}40`,
        };
      }
      
      return {
        boxShadow: baseShadow,
      };
    },
    
    // Hover utilities
    getHoverStyles: (state?: string) => {
      const baseHover = {
        backgroundColor: theme.colors.card.hover,
      };
      
      if (state && state === "on") {
        const stateColor = ThemeUtils.getEntityStateColor(state, theme);
        return {
          ...baseHover,
          borderColor: stateColor,
        };
      }
      
      return baseHover;
    },
  };
};
