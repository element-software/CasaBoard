"use client";
import "./globals.css";
import { HassConnect } from "@hakit/core";
import React from "react";
import { ConfigurableSidebar } from "@/components/Sidebar/ConfigurableSidebar";
import { dashboardConfig } from "@/config/dashboard.config";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const HASS_URL = "https://ha.iqbalibrahim.co.uk";

export default function Template({ children }: { children: React.ReactNode }) {
  const sidebarConfig = dashboardConfig.sidebar;

  // Fallback config if sidebar is not configured
  const defaultSidebarConfig = {
    thermostat: "climate.central_heating_and_hot_water_tank_heat" as const,
    weather: "weather.home" as const,
    showClock: true,
    showWeather: true,
    showThermostat: true,
    showBranding: true,
    brandingImage: "https://element-connect.co.uk/wp-content/uploads/2024/02/EC-Logo-V2-Trimmed-White.png",
    brandingText: "Powered by",
  };

  return (
    <ErrorBoundary>
      <HassConnect hassUrl={HASS_URL}>
        <ConfigurableSidebar config={sidebarConfig || defaultSidebarConfig}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ConfigurableSidebar>
      </HassConnect>
    </ErrorBoundary>
  );
}
