"use client";
import Icon from '@mdi/react';
import { mdiEye, mdiChevronDown, mdiChevronRight, mdiAccount, mdiLogout } from '@mdi/js';
import Link from 'next/link';
import { useConfiguration } from '../ConfigurationProvider';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Breadcrumbs } from './Breadcrumbs';

interface SetupNavigationProps {
  currentPage?: string;
  setCurrentPage?: (page: string) => void;
}

export const SetupNavigation = ({ currentPage = '', setCurrentPage }: SetupNavigationProps = {}) => {
  const { config } = useConfiguration();
  const [isPageDropdownOpen, setIsPageDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  const availablePages = Object.keys(config.pages);

  // Get user data on component mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  const handlePageChange = (pageId: string) => {
    if (setCurrentPage) {
      setCurrentPage(pageId);
    }
    setIsPageDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex items-center justify-between bg-theme-secondary border-b border-theme-border px-6 py-3">
      <div className="flex items-center gap-4">
        <Breadcrumbs />
      </div>
      
      <div className="flex items-center gap-2">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-theme-text bg-theme-background border border-theme-border rounded-lg">
              <Icon path={mdiAccount} className="h-4 w-4" />
              <span className="font-medium">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon path={mdiLogout} className="h-4 w-4" />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-theme-text-secondary bg-theme-secondary border border-theme-border rounded-lg">
            <Icon path={mdiAccount} className="h-4 w-4" />
            <span>Loading user...</span>
          </div>
        )}
        {currentPage && availablePages.length > 0 && (
          <Link
            href={`/${currentPage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-theme-primary text-theme-text-secondary rounded-lg hover:opacity-80 transition-opacity"
          >
            <Icon path={mdiEye} className="h-4 w-4" />
            Preview Live
          </Link>
        )}
      </div>
    </div>
  );
};
