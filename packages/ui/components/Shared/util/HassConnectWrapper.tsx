"use client";
import React, { useEffect } from "react";
import { HAProvider } from "@repo/ha";
import { HAInstance } from "@repo/types/ha";

interface HassConnectWrapperProps {
  children: React.ReactNode;
  haInstance: HAInstance;
}

export const HassConnectWrapper = ({
  children,
  haInstance,
}: HassConnectWrapperProps) => {
  // Log connection details
  useEffect(() => {
    console.log("HassConnectWrapper", {
      instanceId: haInstance.id,
      instanceName: haInstance.name,
      instanceUrl: haInstance.hass_url,
    });
  }, [haInstance.id]);

  return (
    <HAProvider
      haInstance={haInstance}
    >
      {children}
    </HAProvider>
  );
};
