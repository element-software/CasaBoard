"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeConfig, IThemeConfig } from "@repo/config";


interface ThemeContextValue {
  currentTheme: string;
  setTheme: (themeName: string) => void;
  theme: IThemeConfig;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("dark");
  const [theme, setThemeConfig] = useState<IThemeConfig>(ThemeConfig.getTheme("dark"));

  const setTheme = (themeName: string) => {
    setCurrentTheme(themeName);
    localStorage.setItem("dashboard-theme", themeName);
    
    const newTheme = ThemeConfig.getTheme(themeName);
    setThemeConfig(newTheme);
    ThemeConfig.applyTheme(newTheme);
  };

  useEffect(() => {
    // Load theme from localStorage or use default
    const savedTheme = localStorage.getItem("dashboard-theme");
    const initialTheme = savedTheme || "dark";
    
    setCurrentTheme(initialTheme);
    const themeConfig = ThemeConfig.getTheme(initialTheme);
    setThemeConfig(themeConfig);
    ThemeConfig.applyTheme(themeConfig);
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
