"use client";
import React, { useEffect } from "react";
import HassErrorFallback from "./HassErrorFallback";
import { HAProvider } from "@repo/ha";
import { HAInstance } from "../../InstanceManager/HAInstance";
import { useHAInstance } from "@repo/ha";

interface HassConnectWrapperProps {
  children: React.ReactNode;
  haInstance?: HAInstance; // Optional for backward compatibility
  instanceId?: string; // New prop to specify which instance to use
}

export const HassConnectWrapper = ({
  children,
  haInstance,
  instanceId,
}: HassConnectWrapperProps) => {
  const { currentInstance, setCurrentInstanceById, loading, error } =
    useHAInstance();

  // Set current instance based on instanceId prop
  useEffect(() => {
    if (instanceId && currentInstance?.id !== instanceId) {
      setCurrentInstanceById(instanceId);
    }
  }, [instanceId, currentInstance?.id, setCurrentInstanceById]);

  // Use the provided haInstance, currentInstance from context, or fallback to children
  const instanceToUse = haInstance || currentInstance;

  // Only log when instance actually changes to reduce console spam
  useEffect(() => {
    if (instanceToUse) {
      console.log("HassConnectWrapper", {
        instanceId,
        instanceName: instanceToUse.name,
        instanceUrl: instanceToUse.hass_url,
        connected: !!instanceToUse,
      });
    }
  }, [instanceToUse?.id, instanceId]);

  if (error) {
    return <HassErrorFallback error={new Error(error)} />;
  }

  if (!instanceToUse) {
    return children;
  }

  return (
    <HAProvider
      hassUrl={instanceToUse.hass_url}
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
