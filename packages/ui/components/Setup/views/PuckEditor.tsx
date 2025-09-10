"use client";
import { Puck, Data } from "@measured/puck";
import { config as puckConfig } from '../../../lib/puck/puck.config';
import { useState, useEffect } from 'react';
import { usePages } from '@repo/hooks/usePages';
import { Page } from '@/types/page';

interface PuckEditorViewProps {
  currentPage: string;
}

export const PuckEditorView = ({ currentPage }: PuckEditorViewProps) => {
  const { updatePageData, getPage } = usePages();
  const [pageData, setPageData] = useState<Data>({ content: [], root: { props: {} } });
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  // Load page data when currentPage changes
  useEffect(() => {
    const loadPageData = async () => {
      if (!currentPage) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedPage = await getPage(currentPage);
        if (fetchedPage) {
          setPage(fetchedPage);
          setPageData(fetchedPage.puck_data || { content: [], root: { props: {} } });
        }
      } catch (error) {
        console.error('Error loading page data:', error);
        setPageData({ content: [], root: { props: {} } });
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, [currentPage, getPage]);

  const handleSave = async (data: Data) => {
    if (!currentPage) return;

    try {
      await updatePageData(currentPage, data);
      setPageData(data);
      console.log("Page data saved successfully");
    } catch (error) {
      console.error("Error saving page data:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-accent mx-auto mb-2"></div>
          <p className="text-theme-text-secondary">Loading page...</p>
        </div>
      </div>
    );
  }

  if (!currentPage) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-theme-text-secondary">No page selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <Puck
        data={pageData}
        config={puckConfig}
        onPublish={handleSave}
        headerTitle={`Editing: ${page?.name || currentPage}`}
      />
    </div>
  );
};
