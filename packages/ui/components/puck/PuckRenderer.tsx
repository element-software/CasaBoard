"use client";
import { Render } from "@measured/puck";
import { useState, useEffect } from 'react';
import { usePages } from '@repo/hooks/usePages';
import { Page } from '@repo/types/page'
import { PuckConfig } from './puck.config';
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

  return (
    <div className="p-4">
      <Render config={PuckConfig} data={pageData.puck_data} />
    </div>
  );
};
