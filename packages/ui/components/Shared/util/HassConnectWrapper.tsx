"use client";
import React from "react";
import { HAProvider, useHA, reauthenticate } from "@repo/ha";
import { HAConnection } from "@repo/types/ha";
import { ConnectionErrorIndicator } from "./ConnectionErrorFallback";
import { clientLogger } from "@repo/lib";

interface HassConnectWrapperProps {
  children: React.ReactNode;
  haInstance: HAConnection;
}

/**
 * Inner component that uses the HA context to display error UI
 */
const HassConnectWrapperContent = ({
  children,
  haInstance,
}: HassConnectWrapperProps) => {
  const { error, loading, retry } = useHA();

  const handleReauthenticate = async () => {
    try {
      clientLogger.info('HassConnectWrapper', 'initiating re-authentication for', haInstance.hass_url);
      await reauthenticate({ haInstance });
    } catch (error) {
      clientLogger.error('HassConnectWrapper', 're-authentication failed', error);
    }
  };

  // Show error indicator inline if connection failed
  if (error && !loading) {
    return (
      <ConnectionErrorIndicator
        instanceName={haInstance.hass_url}
        instanceUrl={haInstance.hass_url}
        error={error}
        onRetry={retry}
        onReauthenticate={handleReauthenticate}
      />
    );
  }

  return children;
};

/**
 * Wrapper component that provides HA context and handles connection errors gracefully
 */
export const HassConnectWrapper = ({
  children,
  haInstance,
}: HassConnectWrapperProps) => {
  return (
    <HAProvider haInstance={haInstance}>
      <HassConnectWrapperContent haInstance={haInstance}>
        {children}
      </HassConnectWrapperContent>
    </HAProvider>
  );
};
