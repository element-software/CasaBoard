"use client";
import { useState, useEffect } from 'react';
import { useConfiguration } from '../ConfigurationProvider';
import { SetupNavigation } from './SetupNavigation';
import { PagesView } from './views/Pages';
import { PuckEditorView } from './views/PuckEditor';
import { SidebarConfigPanel } from './SidebarConfigPanel';
import Icon from '@mdi/react';
import { mdiFileDocument, mdiViewAgenda, mdiPalette } from '@mdi/js';

// Import Puck CSS
import "@measured/puck/puck.css";

export const PuckEditor = () => {
  const { config } = useConfiguration();
  const [currentPage, setCurrentPage] = useState('');
  const [activeTab, setActiveTab] = useState<'pages' | 'editor' | 'sidebar'>('pages');

  // Initialize current page
  useEffect(() => {
    const availablePages = Object.keys(config.pages);
    if (availablePages.length > 0 && !currentPage) {
      setCurrentPage(availablePages[0]);
    }
  }, [config.pages, currentPage]);

  const hasPages = Object.keys(config.pages).length > 0;

  return (
    <div className="flex flex-col h-screen">
      {/* Navigation Bar */}
      <SetupNavigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {/* Tab Navigation */}
      <div className="bg-theme-secondary border-b border-theme-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab('pages')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'pages'
                ? 'text-theme-accent border-b-2 border-theme-accent'
                : 'text-theme-text hover:text-theme-accent'
            }`}
          >
            <Icon path={mdiFileDocument} className="h-4 w-4" />
            Pages
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            disabled={!hasPages}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'editor'
                ? 'text-theme-accent border-b-2 border-theme-accent'
                : hasPages ? 'text-theme-text hover:text-theme-accent' : 'text-theme-text-secondary cursor-not-allowed'
            }`}
          >
            <Icon path={mdiPalette} className="h-4 w-4" />
            Page Editor
          </button>
          <button
            onClick={() => setActiveTab('sidebar')}
            disabled={!hasPages}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'sidebar'
                ? 'text-theme-accent border-b-2 border-theme-accent'
                : hasPages ? 'text-theme-text hover:text-theme-accent' : 'text-theme-text-secondary cursor-not-allowed'
            }`}
          >
            <Icon path={mdiViewAgenda} className="h-4 w-4" />
            Sidebar Config
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'pages' && (
          <PagesView 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
        
        {activeTab === 'editor' && currentPage && (
          <PuckEditorView currentPage={currentPage} />
        )}
        
        {activeTab === 'sidebar' && currentPage && (
          <div className="h-full flex justify-center overflow-y-auto">
            <div className="w-full max-w-2xl">
              <SidebarConfigPanel pageId={currentPage} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
