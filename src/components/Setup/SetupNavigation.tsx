"use client";
import Icon from '@mdi/react';
import { mdiHome, mdiCog, mdiChevronRight, mdiEye } from '@mdi/js';
import Link from 'next/link';
import { useDragDrop } from './DragDropProvider';

export const SetupNavigation = () => {
  const { currentPage } = useDragDrop();

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
            <span className="font-medium capitalize">{currentPage}</span>
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
