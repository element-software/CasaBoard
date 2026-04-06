"use client";

import { useState, useEffect } from "react";
import { PageStorage } from "@repo/lib";
import { PuckRenderer } from "@repo/ui/components/puck/PuckRenderer";
import { HassConnectWrapper } from "@repo/ui/components/Shared/util/HassConnectWrapper";
import { HAInstance } from "@repo/types/ha";
import { Page } from "@repo/types/page";

interface DashboardPageClientProps {
  slug: string;
}

export function DashboardPageClient({ slug }: DashboardPageClientProps) {
  const [pageData, setPageData] = useState<Page | null>(null);
  const [haInstance, setHaInstance] = useState<HAInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    PageStorage.getPage(slug)
      .then((page) => {
        if (!page || !page.ha_instance) {
          setNotFound(true);
        } else {
          setPageData(page);
          setHaInstance({ ...page.ha_instance, hass_token: "" });
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-theme-text-secondary text-sm">Loading...</div>
      </div>
    );
  }

  if (notFound || !pageData || !haInstance) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-theme-text mb-2">Page not found</h2>
          <p className="text-theme-text-secondary">
            This page does not exist or has no Home Assistant instance configured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <HassConnectWrapper haInstance={haInstance}>
      <PuckRenderer pageId={slug} pageData={pageData} />
    </HassConnectWrapper>
  );
}
