"use client";

import { Render } from "@measured/puck";
import { Page } from "@repo/types/page";
import { PuckConfig } from "./puck.config";
interface PuckRendererProps {
  pageId: string;
  pageData?: Page;
}

export const PuckRenderer = ({ pageId, pageData }: PuckRendererProps) => {
  if (!pageData) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error loading page: {pageId}</p>
      </div>
    );
  }

  // If no page found or no Puck data, show fallback
  if (!pageData?.puck_data) {
    return (
      <div className="p-8 text-center text-theme-text-secondary">
        <p>This page hasn&apos;t been configured yet.</p>
        <p>Use the setup editor to add components to this page.</p>
      </div>
    );
  }

  const renderSidebar = () => {
    if (!pageData.sidebar || !pageData.sidebar.puck_data) {
      return null;
    }
    
    try {
      return (
        <div className="min-w-[300px] border-r border-white h-screen p-4">
          <Render config={PuckConfig} data={pageData.sidebar.puck_data} />
        </div>
      );
    } catch (error) {
      console.error("Error rendering sidebar:", error);
      return (
        <div className="sidebar-content mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>
            Error rendering sidebar:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-row gap-4">
      {renderSidebar()}
      <div className="p-4 w-full grow">
        <Render config={PuckConfig} data={pageData.puck_data} />
      </div>
    </div>
  );
};
