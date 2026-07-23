"use client";

import { useEffect, useState } from "react";
import type { Page } from "@repo/types/page";
import { PuckRenderer } from "../../puck/PuckRenderer";
import { HassConnectWrapper } from "./HassConnectWrapper";
import { useHAConnection } from "@repo/hooks";
import { Button, Spinner } from "@heroui/react";
import NextLink from "next/link";
import type { CSSProperties } from "react";

type DashboardHAClientProps = {
  page: Page;
  pageSlug: string;
  themeMainStyle?: CSSProperties;
  themeSidebarStyle?: CSSProperties;
};

export function DashboardHAClient({
  page,
  pageSlug,
  themeMainStyle,
  themeSidebarStyle,
}: DashboardHAClientProps) {
  const { connection, loading } = useHAConnection();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="flex justify-center p-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!connection) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
        <p className="text-foreground-600 max-w-md">
          This dashboard needs a Home Assistant connection.
        </p>
        <Button as={NextLink} href="/setup/ha-config" color="primary">
          Configure Home Assistant
        </Button>
      </div>
    );
  }

  return (
    <HassConnectWrapper haInstance={connection}>
      <PuckRenderer
        pageId={pageSlug}
        pageData={page}
        themeMainStyle={themeMainStyle}
        themeSidebarStyle={themeSidebarStyle}
      />
    </HassConnectWrapper>
  );
}
