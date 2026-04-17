"use client";

import { useEffect, useState } from "react";
import type { Page } from "@repo/types/page";
import type { Entitlements } from "@repo/types/subscription";
import { PuckRenderer } from "../../puck/PuckRenderer";
import { HassConnectWrapper } from "./HassConnectWrapper";
import { useMergedHAInstances } from "@repo/hooks";
import { Button, Spinner } from "@heroui/react";
import NextLink from "next/link";

type DashboardHAClientProps = {
  page: Page;
  pageSlug: string;
  entitlements: Entitlements;
};

export function DashboardHAClient({
  page,
  pageSlug,
  entitlements,
}: DashboardHAClientProps) {
  const { instances, loading } = useMergedHAInstances(entitlements);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const haId =
    (page.puck_data?.root?.props as { haInstanceId?: string } | undefined)
      ?.haInstanceId ?? instances[0]?.id;
  const haInstance = instances.find((i) => i.id === haId) ?? instances[0];

  if (!mounted || loading) {
    return (
      <div className="flex justify-center p-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!haInstance) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
        <p className="text-foreground-600 max-w-md">
          This dashboard needs a Home Assistant connection. Add an instance in
          settings and link it in the page editor (Page settings → Home Assistant
          instance).
        </p>
        <Button as={NextLink} href="/setup/ha-config" color="primary">
          Configure Home Assistant
        </Button>
      </div>
    );
  }

  return (
    <HassConnectWrapper haInstance={haInstance}>
      <PuckRenderer pageId={pageSlug} pageData={page} />
    </HassConnectWrapper>
  );
}
