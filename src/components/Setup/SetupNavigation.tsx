"use client";
import Icon from '@mdi/react';
import { mdiHome, mdiCog, mdiChevronRight, mdiEye, mdiChevronDown } from '@mdi/js';
import Link from 'next/link';
import { useDragDrop } from './DragDropProvider';
import { dashboardConfig } from '@/config/dashboard.config';
import { useState, useEffect, useRef } from 'react';

export const SetupNavigation = () => {
  const { currentPage, setCurrentPage, loadFromCurrentConfig } = useDragDrop();
  const [isPageDropdownOpen, setIsPageDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availablePages = Object.keys(dashboardConfig.pages);

  const handlePageChange = (pageId: string) => {
    setCurrentPage(pageId);
    loadFromCurrentConfig(pageId);
    setIsPageDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between bg-theme-surface border-b border-theme-border px-6 py-3">
      <div className="flex items-center gap-2 text-sm text-theme-text">
        <Link 
          href="/" 
          className="flex items-center gap-1 hover:text-theme-accent transition-colors"
        >
          <Icon path={mdiHome} className="h-4 w-4" />
          Dashboard
        </Link>
        <Icon path={mdiChevronRight} className="h-4 w-4 text-theme-text-secondary" />
        <Icon path={mdiCog} className="h-4 w-4" />
        <span>Setup Editor</span>
        {currentPage && (
          <>
            <Icon path={mdiChevronRight} className="h-4 w-4 text-theme-text-secondary" />
            {/* Page Selector Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsPageDropdownOpen(!isPageDropdownOpen)}
                className="flex items-center gap-1 font-medium capitalize hover:text-theme-accent transition-colors"
              >
                {currentPage}
                <Icon path={mdiChevronDown} className="h-3 w-3" />
              </button>
              
              {isPageDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-theme-surface border border-theme-border rounded-lg shadow-lg z-50 min-w-[120px]">
                  {availablePages.map((pageId) => (
                    <button
                      key={pageId}
                      onClick={() => handlePageChange(pageId)}
                      className={`block w-full px-3 py-2 text-left text-sm capitalize hover:bg-theme-background transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        pageId === currentPage ? 'text-theme-accent bg-theme-background' : 'text-theme-text'
                      }`}
                    >
                      {pageId}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Link
          href={`/${currentPage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-theme-primary text-black rounded-lg hover:opacity-80 transition-opacity"
        >
          <Icon path={mdiEye} className="h-4 w-4" />
          Preview Live
        </Link>
      </div>
    </div>
  );
};
