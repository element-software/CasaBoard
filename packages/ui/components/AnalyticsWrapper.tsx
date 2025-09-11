"use client";
import React, { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { CookieConsent, getCookieConsent } from "./CookieConsent";
import { GoogleAnalytics } from "@next/third-parties/google";

type AnalyticsWrapperProps = {
  gaId?: string;
};

export const AnalyticsWrapper: React.FC<AnalyticsWrapperProps> = ({ gaId }) => {
  const [consent, setConsent] = useState<"accepted" | "rejected" | null>(null);

  useEffect(() => {
    setConsent(getCookieConsent());
  }, []);

  return (
    <>
      {consent === "accepted" && (
        <>
          <Analytics />
          <GoogleAnalytics gaId={gaId ?? ""} />
        </>
      )}
      <CookieConsent
        onAccept={() => setConsent("accepted")}
        onReject={() => setConsent("rejected")}
      />
    </>
  );
};
