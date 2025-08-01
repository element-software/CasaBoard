"use client";
import React, { useState, useEffect } from "react";
import { predefinedThemes, getTheme } from "@/config/themes";
import { dashboardConfig } from "@/config/dashboard.config";
import { useTheme } from "./ThemeProvider";
import classNames from "classnames";

interface ThemeSwitchProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ 
  className, 
  showLabel = true 
}) => {
  const { currentTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (themeName: string) => {
    setTheme(themeName);
    setIsOpen(false);
  };

  // Don't render if theme switching is disabled
  if (!dashboardConfig.global?.enableThemeSwitch) {
    return null;
  }

  const availableThemes = {
    ...predefinedThemes,
    ...(dashboardConfig.global?.customThemes || {})
  };

  const currentThemeConfig = getTheme(currentTheme, dashboardConfig.global?.customThemes);

  return (
    <div className={classNames("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 text-theme-secondary hover:text-theme-text hover:bg-theme-surface rounded-lg transition-colors"
        aria-label="Change theme"
      >
        <div 
          className="w-4 h-4 rounded-full border-2 border-theme-border"
          style={{ backgroundColor: currentThemeConfig.colors.primary }}
        />
        {showLabel && (
          <span className="text-sm font-medium">{currentThemeConfig.name}</span>
        )}
        <svg
          className={classNames("w-4 h-4 transition-transform", {
            "rotate-180": isOpen
          })}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute w-full bottom-full left-0 mt-2 py-2 bg-theme-surface border border-theme-border rounded-lg shadow-lg z-50 min-w-[160px]">
          {Object.entries(availableThemes).map(([themeName, themeConfig]) => (
            <button
              key={themeName}
              onClick={() => handleThemeChange(themeName)}
              className={classNames(
                "w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-theme-background transition-colors",
                {
                  "bg-theme-background": currentTheme === themeName
                }
              )}
            >
              <div 
                className="w-4 h-4 rounded-full border-2 border-theme-border"
                style={{ backgroundColor: themeConfig.colors.primary }}
              />
              <span className="text-sm text-theme-text">{themeConfig.name}</span>
              {currentTheme === themeName && (
                <svg
                  className="w-4 h-4 text-theme-success ml-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
