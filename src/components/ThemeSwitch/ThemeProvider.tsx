"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getTheme, applyTheme } from "@/config/themes";
import { dashboardConfig } from "@/config/dashboard.config";

interface ThemeContextValue {
  currentTheme: string;
  setTheme: (themeName: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(
    dashboardConfig.global?.theme || "dark"
  );

  const setTheme = (themeName: string) => {
    setCurrentTheme(themeName);
    localStorage.setItem("dashboard-theme", themeName);
    
    const theme = getTheme(themeName, dashboardConfig.global?.customThemes);
    applyTheme(theme);
  };

  useEffect(() => {
    // Load theme from localStorage or use default
    const savedTheme = localStorage.getItem("dashboard-theme");
    const initialTheme = savedTheme || dashboardConfig.global?.theme || "dark";
    
    setCurrentTheme(initialTheme);
    const theme = getTheme(initialTheme, dashboardConfig.global?.customThemes);
    applyTheme(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
