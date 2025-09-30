"use client";
import { Render } from "@measured/puck";
import { useState, useEffect } from 'react';
import { usePages } from '@repo/hooks/usePages';
import { Page } from '@repo/types/page'
import { PuckConfig } from './puck/puck.config';
interface PuckRendererProps {
  pageId: string;
  pageData?: Page;
}

export const PuckRenderer = ({ pageId, pageData }: PuckRendererProps) => {
  // Use pageData if provided, otherwise fall back to fetching
  const { getPage } = usePages();
  const [page, setPage] = useState<Page | null>(pageData || null);
  const [loading, setLoading] = useState(!pageData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if we don't have pageData
    if (!pageData) {
      const loadPage = async () => {
        try {
          setLoading(true);
          setError(null);
          const fetchedPage = await getPage(pageId);
          setPage(fetchedPage);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load page');
        } finally {
          setLoading(false);
        }
      };

      if (pageId) {
        loadPage();
      }
    }
  }, [pageId, getPage, pageData]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-accent mx-auto mb-2"></div>
        <p className="text-theme-text-secondary">Loading page...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error loading page: {error}</p>
      </div>
    );
  }

  // If no page found or no Puck data, show fallback
  if (!page?.puck_data) {
    return (
      <div className="p-8 text-center text-theme-text-secondary">
        <p>This page hasn&apos;t been configured yet.</p>
        <p>Use the setup editor to add components to this page.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Render config={PuckConfig} data={page.puck_data} />
    </div>
  );
};
