"use client";
import React from "react";
import HassErrorFallback from "./HassErrorFallback";
import { HAProvider } from "@repo/ha";
import { HAInstance } from "./InstanceManager/HAInstance";

interface HassConnectWrapperProps {
  children: React.ReactNode;
  haInstance: HAInstance;
}

export const HassConnectWrapper = ({
  children,
  haInstance,
}: HassConnectWrapperProps) => {
  return (
    <HAProvider
      hassUrl={haInstance.hass_url}
      fallback={
        <HassErrorFallback
          error={new Error("Failed to connect to Home Assistant")}
        />
      }
    >
      {children}
    </HAProvider>
  );
};
