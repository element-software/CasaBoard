"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HAProvider, useHA, reauthenticateInstance } from "@repo/ha";
import { HAInstance } from "@repo/types/ha";
import { ConnectionErrorIndicator } from "./ConnectionErrorFallback";
import { clientLogger } from "@repo/lib";

interface HassConnectWrapperProps {
  children: React.ReactNode;
  haInstance: HAInstance;
  onDelete?: (id: string) => void;
}

/**
 * Inner component that uses the HA context to display error UI
 */
const HassConnectWrapperContent = ({
  children,
  haInstance,
  onDelete,
}: HassConnectWrapperProps) => {
  const { error, loading, retry } = useHA();
  const router = useRouter();

  // Log connection details
  useEffect(() => {
    console.log("HassConnectWrapper", {
      instanceId: haInstance.id,
      instanceName: haInstance.name,
      instanceUrl: haInstance.hass_url,
    });
  }, [haInstance.id]);

  const handleReauthenticate = async () => {
    try {
      clientLogger.info('HassConnectWrapper', 'initiating re-authentication for', haInstance.id);
      // This will clear the old token and start a fresh OAuth flow
      // The user will be redirected to Home Assistant for login
      // After successful auth, they'll be redirected back to /setup/ha-config
      await reauthenticateInstance({ haInstance });
    } catch (error) {
      clientLogger.error('HassConnectWrapper', 're-authentication failed', error);
      // Even if there's an error, the OAuth flow may have started
      // The user might still be redirected to Home Assistant
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(haInstance.id);
    }
  };

  // Show error indicator inline if connection failed
  if (error && !loading) {
    return (
      <ConnectionErrorIndicator
        instanceName={haInstance.name}
        instanceUrl={haInstance.hass_url}
        error={error}
        onRetry={retry}
        onReauthenticate={handleReauthenticate}
        onDelete={onDelete ? handleDelete : undefined}
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
  onDelete,
}: HassConnectWrapperProps) => {
  return (
    <HAProvider haInstance={haInstance}>
      <HassConnectWrapperContent haInstance={haInstance} onDelete={onDelete}>
        {children}
      </HassConnectWrapperContent>
    </HAProvider>
  );
};
