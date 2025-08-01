import { ThemeConfig } from "./dashboard.types";

export const predefinedThemes: Record<string, ThemeConfig> = {
  dark: {
    name: "Dark",
    colors: {
      primary: "#f59e0b", // amber-500
      secondary: "#6b7280", // gray-500
      accent: "#f97316", // orange-500
      background: "#171717", // neutral-900
      surface: "#262626", // neutral-800
      text: "#ffffff",
      textSecondary: "#9ca3af", // gray-400
      border: "#404040", // neutral-700
      success: "#10b981", // emerald-500
      warning: "#f59e0b", // amber-500
      error: "#ef4444", // red-500
      gradientFrom: "#262626", // neutral-800
      gradientTo: "#171717", // neutral-900
    },
  },
  light: {
    name: "Light",
    colors: {
      primary: "#3b82f6", // blue-500
      secondary: "#6b7280", // gray-500
      accent: "#8b5cf6", // violet-500
      background: "#ffffff",
      surface: "#f9fafb", // gray-50
      text: "#111827", // gray-900
      textSecondary: "#6b7280", // gray-500
      border: "#e5e7eb", // gray-200
      success: "#10b981", // emerald-500
      warning: "#f59e0b", // amber-500
      error: "#ef4444", // red-500
      gradientFrom: "#f9fafb", // gray-50
      gradientTo: "#f3f4f6", // gray-100
    },
  },
  blue: {
    name: "Ocean Blue",
    colors: {
      primary: "#0ea5e9", // sky-500
      secondary: "#64748b", // slate-500
      accent: "#06b6d4", // cyan-500
      background: "#0f172a", // slate-900
      surface: "#1e293b", // slate-800
      text: "#f8fafc", // slate-50
      textSecondary: "#94a3b8", // slate-400
      border: "#334155", // slate-700
      success: "#10b981", // emerald-500
      warning: "#f59e0b", // amber-500
      error: "#ef4444", // red-500
      gradientFrom: "#1e293b", // slate-800
      gradientTo: "#0f172a", // slate-900
    },
  },
  purple: {
    name: "Deep Purple",
    colors: {
      primary: "#8b5cf6", // violet-500
      secondary: "#6b7280", // gray-500
      accent: "#a855f7", // purple-500
      background: "#1e1b4b", // indigo-900
      surface: "#312e81", // indigo-800
      text: "#f8fafc", // slate-50
      textSecondary: "#c7d2fe", // indigo-200
      border: "#4338ca", // indigo-700
      success: "#10b981", // emerald-500
      warning: "#f59e0b", // amber-500
      error: "#ef4444", // red-500
      gradientFrom: "#312e81", // indigo-800
      gradientTo: "#1e1b4b", // indigo-900
    },
  },
  green: {
    name: "Forest Green",
    colors: {
      primary: "#10b981", // emerald-500
      secondary: "#6b7280", // gray-500
      accent: "#059669", // emerald-600
      background: "#064e3b", // emerald-900
      surface: "#065f46", // emerald-800
      text: "#f0fdf4", // green-50
      textSecondary: "#86efac", // green-300
      border: "#047857", // emerald-700
      success: "#10b981", // emerald-500
      warning: "#f59e0b", // amber-500
      error: "#ef4444", // red-500
      gradientFrom: "#065f46", // emerald-800
      gradientTo: "#064e3b", // emerald-900
    },
  },
  amber: {
    name: "Sunset Amber",
    colors: {
      primary: "#f59e0b", // amber-500
      secondary: "#78716c", // stone-500
      accent: "#f97316", // orange-500
      background: "#451a03", // amber-900
      surface: "#92400e", // amber-800
      text: "#fffbeb", // amber-50
      textSecondary: "#fcd34d", // amber-300
      border: "#b45309", // amber-700
      success: "#10b981", // emerald-500
      warning: "#f59e0b", // amber-500
      error: "#ef4444", // red-500
      gradientFrom: "#92400e", // amber-800
      gradientTo: "#451a03", // amber-900
    },
  },
};

export const getTheme = (themeName: string, customThemes?: Record<string, ThemeConfig>): ThemeConfig => {
  // Check custom themes first
  if (customThemes && customThemes[themeName]) {
    return customThemes[themeName];
  }
  
  // Fall back to predefined themes
  return predefinedThemes[themeName] || predefinedThemes.dark;
};

export const applyTheme = (theme: ThemeConfig) => {
  const root = document.documentElement;
  
  // Apply CSS custom properties
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-accent', theme.colors.accent);
  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-surface', theme.colors.surface);
  root.style.setProperty('--color-text', theme.colors.text);
  root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
  root.style.setProperty('--color-border', theme.colors.border);
  root.style.setProperty('--color-success', theme.colors.success);
  root.style.setProperty('--color-warning', theme.colors.warning);
  root.style.setProperty('--color-error', theme.colors.error);
  root.style.setProperty('--color-gradient-from', theme.colors.gradientFrom);
  root.style.setProperty('--color-gradient-to', theme.colors.gradientTo);
};
