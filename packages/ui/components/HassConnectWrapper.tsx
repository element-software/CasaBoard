"use client";
import dynamic from "next/dynamic";
import React from "react";
import { UserSettings } from "@repo/types/userSettings";
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
  // Load @hakit/core only on the client to avoid 'window is not defined'
  const HassConnect = dynamic(
    () => import("@hakit/core").then((m) => m.HassConnect),
    { ssr: false }
  );
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
