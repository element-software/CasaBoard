"use client";
import { DashboardGrid } from "@/components/DashboardGrid";
import { useConfiguration } from "@/components/ConfigurationProvider";
import { useEffect, useState } from "react";
import { PageConfig } from "@/config/dashboard.types";

interface ClientPageWrapperProps {
  pageName: string;
  fallbackConfig: PageConfig;
}

export const ClientPageWrapper = ({ pageName, fallbackConfig }: ClientPageWrapperProps) => {
  const { config } = useConfiguration();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Use live config when available, fallback during SSR
  const currentConfig = isClient ? config : { pages: { [pageName]: fallbackConfig } };
  const pageConfig = currentConfig.pages[pageName as keyof typeof currentConfig.pages] || fallbackConfig;

  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {pageConfig.title?.showTitle && (
          <h1 className="text-xl sm:text-2xl font-bold text-theme-text mb-4 lg:mb-6 text-center lg:text-left">
            {pageConfig.title.value}
          </h1>
        )}
        <div className="flex justify-center lg:justify-start">
          <DashboardGrid config={pageConfig.layout} className="w-full" />
        </div>
      </div>
    </main>
  );
};
