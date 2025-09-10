"use client";
import { useState } from 'react';
import { usePages } from '@repo/hooks/usePages';
import Icon from '@mdi/react';
import { 
  mdiPlus, 
  mdiTrashCan, 
  mdiFileDocument
} from '@mdi/js';

interface PageManagerProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const PageManager = ({ currentPage, setCurrentPage }: PageManagerProps) => {
  const { pages, loading, error, createPage, deletePage } = usePages();
  const [newPageName, setNewPageName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageName.trim()) return;

    setIsCreating(true);
    try {
      const newPage = await createPage(newPageName.trim());
      setCurrentPage(newPage.slug);
      setNewPageName('');
    } catch (error) {
      console.error('Error creating page:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePage = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    
    try {
      await deletePage(slug);
      if (currentPage === slug) {
        const remainingPages = pages.filter(p => p.slug !== slug);
        setCurrentPage(remainingPages.length > 0 ? remainingPages[0].slug : '');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-accent mx-auto mb-2"></div>
        <p className="text-theme-text-secondary">Loading pages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-theme-text mb-4">
          <Icon path={mdiFileDocument} className="h-6 w-6 inline mr-2" />
          Page Management
        </h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Create New Page */}
        <form onSubmit={handleCreatePage} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              placeholder="Enter page name..."
              className="flex-1 px-3 py-2 border border-theme-border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-accent bg-theme-surface text-theme-text"
              disabled={isCreating}
            />
            <button
              type="submit"
              disabled={isCreating || !newPageName.trim()}
              className="px-4 py-2 bg-theme-accent text-white rounded-md hover:bg-theme-accent/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Icon path={mdiPlus} className="h-4 w-4" />
              {isCreating ? 'Creating...' : 'Create Page'}
            </button>
          </div>
        </form>

        {/* Pages List */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-theme-text">Your Pages</h3>
          
          {pages.length === 0 ? (
            <div className="text-center py-8">
              <Icon path={mdiFileDocument} className="h-12 w-12 mx-auto mb-3 opacity-50 text-theme-text-secondary" />
              <p className="text-theme-text-secondary">No pages created yet.</p>
              <p className="text-theme-text-secondary">Create your first page above!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    currentPage === page.slug
                      ? 'border-theme-accent bg-theme-accent/10'
                      : 'border-theme-border hover:bg-theme-surface/50'
                  }`}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-theme-text">{page.name}</h4>
                    <p className="text-sm text-theme-text-secondary">/{page.slug}</p>
                    <p className="text-xs text-theme-text-secondary">
                      Created: {new Date(page.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(page.slug)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        currentPage === page.slug
                          ? 'bg-theme-accent text-white'
                          : 'bg-theme-surface text-theme-text hover:bg-theme-accent/20'
                      }`}
                    >
                      {currentPage === page.slug ? 'Current' : 'Select'}
                    </button>
                    
                    <button
                      onClick={() => handleDeletePage(page.slug)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center gap-1"
                      title="Delete page"
                    >
                      <Icon path={mdiTrashCan} className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
