// Theme Configuration System
// Centralized theme management with component-specific utilities

export interface ThemeColors {
  // Base colors
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  
  // Brand colors
  primary: string;
  secondary: string;
  accent: string;
  
  // State colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Component-specific colors
  card: {
    background: string;
    border: string;
    hover: string;
  };
  
  // Entity state colors
  entity: {
    on: string;
    off: string;
    unavailable: string;
    unknown: string;
  };
  
  // Interactive elements
  button: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
  };
  
  // Slider colors
  slider: {
    track: string;
    thumb: string;
    active: string;
  };
}

export interface IThemeConfig {
  name: string;
  colors: ThemeColors;
  isDark: boolean;
}

// Dark Theme (Default)
export const darkTheme: IThemeConfig = {
  name: "Dark",
  isDark: true,
  colors: {
    // Base colors
    background: "#171717", // neutral-900
    surface: "#262626", // neutral-800
    text: "#ffffff",
    textSecondary: "#a3a3a3", // neutral-400
    border: "#404040", // neutral-700
    
    // Brand colors
    primary: "#f59e0b", // amber-500 (gold)
    secondary: "#6b7280", // gray-500
    accent: "#fbbf24", // amber-400
    
    // State colors
    success: "#10b981", // emerald-500
    warning: "#f59e0b", // amber-500
    error: "#ef4444", // red-500
    info: "#3b82f6", // blue-500
    
    // Component-specific colors
    card: {
      background: "#262626", // neutral-800
      border: "#404040", // neutral-700
      hover: "#2a2a2a", // neutral-750
    },
    
    // Entity state colors
    entity: {
      on: "#10b981", // emerald-500
      off: "#6b7280", // gray-500
      unavailable: "#ef4444", // red-500
      unknown: "#f59e0b", // amber-500
    },
    
    // Interactive elements
    button: {
      primary: "#f59e0b", // amber-500
      secondary: "#6b7280", // gray-500
      success: "#10b981", // emerald-500
      warning: "#f59e0b", // amber-500
      error: "#ef4444", // red-500
    },
    
    // Slider colors
    slider: {
      track: "#404040", // neutral-700
      thumb: "#f59e0b", // amber-500
      active: "#fbbf24", // amber-400
    },
  },
};

// Light Theme
export const lightTheme: IThemeConfig = {
  name: "Light",
  isDark: false,
  colors: {
    // Base colors
    background: "#ffffff",
    surface: "#f9fafb", // gray-50
    text: "#111827", // gray-900
    textSecondary: "#6b7280", // gray-500
    border: "#e5e7eb", // gray-200
    
    // Brand colors
    primary: "#3b82f6", // blue-500
    secondary: "#6b7280", // gray-500
    accent: "#2563eb", // blue-600
    
    // State colors
    success: "#10b981", // emerald-500
    warning: "#f59e0b", // amber-500
    error: "#ef4444", // red-500
    info: "#3b82f6", // blue-500
    
    // Component-specific colors
    card: {
      background: "#ffffff",
      border: "#e5e7eb", // gray-200
      hover: "#f9fafb", // gray-50
    },
    
    // Entity state colors
    entity: {
      on: "#10b981", // emerald-500
      off: "#6b7280", // gray-500
      unavailable: "#ef4444", // red-500
      unknown: "#f59e0b", // amber-500
    },
    
    // Interactive elements
    button: {
      primary: "#3b82f6", // blue-500
      secondary: "#6b7280", // gray-500
      success: "#10b981", // emerald-500
      warning: "#f59e0b", // amber-500
      error: "#ef4444", // red-500
    },
    
    // Slider colors
    slider: {
      track: "#e5e7eb", // gray-200
      thumb: "#3b82f6", // blue-500
      active: "#2563eb", // blue-600
    },
  },
};

// Theme registry
export const themes: Record<string, IThemeConfig> = {
  dark: darkTheme,
  light: lightTheme,
};

// Get theme by name
export const getTheme = (themeName: string): IThemeConfig => {
  return themes[themeName] || darkTheme;
};

// Apply theme to document
export const applyTheme = (theme: IThemeConfig) => {
  const root = document.documentElement;
  
  // Apply CSS custom properties
  Object.entries(theme.colors).forEach(([key, value]) => {
    if (typeof value === 'string') {
      root.style.setProperty(`--theme-${key}`, value);
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        root.style.setProperty(`--theme-${key}-${subKey}`, String(subValue));
      });
    }
  });
  
  // Set theme class for conditional styling
  root.classList.toggle('dark', theme.isDark);
  root.classList.toggle('light', !theme.isDark);
};
