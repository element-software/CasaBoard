"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { dashboardConfig } from "@/config/dashboard.config";
import Link from "next/link";
import classNames from "classnames";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
  const pathname = usePathname();

  // Extract page name from pathname (remove leading slash and any base path)
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentPageName = pathSegments[pathSegments.length - 1] || "";

  // Get available pages
  const availablePages = Object.keys(dashboardConfig.pages || {});

  // Get page title from config
  const pageConfig = dashboardConfig.pages?.[currentPageName];
  const pageTitle = pageConfig?.title?.value || currentPageName || "Dashboard";

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-neutral-900 border-b border-neutral-700">
      {/* Header with menu button and title */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuClick}
            className="p-2 text-white hover:bg-neutral-800 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {availablePages.length > 0 && (
            <div className="px-4">
              <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
                {availablePages.map((pageName) => {
                  const isActive = pageName === currentPageName;
                  const pageTitle =
                    dashboardConfig.pages[pageName]?.title?.value || pageName;

                  return (
                    <Link
                      key={pageName}
                      href={`/${pageName}`}
                      className={classNames(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                        {
                          "bg-amber-400 text-black": isActive,
                          "text-gray-400 hover:text-white hover:bg-neutral-800":
                            !isActive,
                        }
                      )}
                    >
                      {pageTitle}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
