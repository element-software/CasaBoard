"use client";
import { HassConnect } from "@hakit/core";
import React from "react";
import { UserSettings } from "@/types/userSettings";
import { usePathname } from "next/navigation";

interface HassConnectWrapperProps {
  children: React.ReactNode;
  userSettings: UserSettings | null;
  decryptedToken: string | null;
}

export const HassConnectWrapper = ({ 
  children, 
  userSettings, 
  decryptedToken 
}: HassConnectWrapperProps) => {
  const pathname = usePathname();

  // Pages that don't need HA connectivity
  const noHAPages = ['/setup'];
  const needsHA = !noHAPages.some(page => pathname === page);

  console.log("HassConnectWrapper:: needsHA", needsHA);

  // If this page doesn't need HA, render children directly
  if (!needsHA) {
    return <>{children}</>;
  }

  // If no HA settings configured, render children without HA connection
  if (!userSettings?.hass_url || !decryptedToken) {
    return <>{children}</>;
  }

  return (
    <HassConnect 
      hassUrl={userSettings.hass_url}
      hassToken={decryptedToken}
    >
      {children}
    </HassConnect>
  );
};
