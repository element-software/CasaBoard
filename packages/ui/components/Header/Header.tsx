"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SupabaseClient } from "@repo/lib";
import { Breadcrumbs } from "@repo/ui/components/Setup/Breadcrumbs";
import Icon from "@mdi/react";
import { mdiAccount, mdiLogout, mdiChevronDown } from "@mdi/js";
import { CasaBoardLogo } from "../Logo";
import { Button } from "@heroui/react";
import Link from "next/link";

// User Menu Component
function UserMenu() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const supabase = SupabaseClient.createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-theme-text-secondary bg-theme-secondary border border-theme-border rounded-lg">
        <Icon path={mdiAccount} className="h-3 w-3" />
        <span className="hidden sm:inline">Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-theme-text bg-theme-background border border-theme-border rounded-lg hover:bg-theme-secondary transition-colors"
      >
        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-theme-background rounded-full flex items-center justify-center border-theme-primary">
          <span className="text-xs font-medium text-theme-text-primary">
            {user.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="font-medium max-w-20 sm:max-w-32 truncate hidden sm:inline">
          {user.email}
        </span>
        <Icon 
          path={mdiChevronDown} 
          className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-theme-background border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="p-3 sm:p-4 border-b border-theme-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-theme-background rounded-full flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-medium text-theme-text-primary">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-theme-text-primary text-sm truncate">{user.email}</p>
                  <p className="text-xs text-theme-text-secondary">Smart Home User</p>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon path={mdiLogout} className="h-3 w-3 sm:h-4 sm:w-4" />
                {isLoggingOut ? "Logging out..." : "Sign out"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface HeaderProps {
  public?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ public: isPublic = false }) => {
  const pathname = usePathname();
  const hideBreadcrumbs = isPublic && pathname === "/";
  return (
    <header className="sticky top-0 z-30 bg-theme-background/80 backdrop-blur-md border-b border-r border-l rounded-b-xl border-theme-border/20 max-w-7xl mx-auto">
      <div className="px-0 mx-auto">
        <div className="flex items-center h-14 sm:px-4 px-2 sm:h-16">
          {/* Left side - Mobile Menu and Logo */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div className="min-w-0">
              <CasaBoardLogo 
                variant="dark" 
                size="small"
                className="max-w-fit"
              />
            </div>
          </div>


          {/* Right side - User Menu (only show if not public) */}
          {!isPublic ? (
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-auto">
              <UserMenu />
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-auto">
              <Button as={Link} color="primary" href="https://app.casaboard.dev" className="text-white font-medium hover:text-theme-text-primary/80 transition-colors">Login</Button>
              <Button as={Link} variant="bordered" color="primary" href="https://demo.casaboard.dev" className="text-theme-text-primary hover:text-theme-text-primary/80 transition-colors">View Demo</Button>
            </div>
          )}
        </div>
        
        {/* Breadcrumbs - hide on public homepage */}
        {!hideBreadcrumbs && (
          <div className="border-t border-theme-border/50 px-2 py-2">
            <Breadcrumbs showHome={!isPublic} />
          </div>
        )}
      </div>
    </header>
  );
};
