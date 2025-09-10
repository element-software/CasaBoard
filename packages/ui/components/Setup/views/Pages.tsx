"use client";
import { PageManager } from '../PageManager';

interface PagesViewProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const PagesView = ({ currentPage, setCurrentPage }: PagesViewProps) => {
  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <PageManager 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};
