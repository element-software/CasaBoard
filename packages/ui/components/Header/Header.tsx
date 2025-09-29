"use client";

import React, { useState } from "react";
import Icon from "@mdi/react";
import { mdiMenu } from "@mdi/js";
import { CasaBoardLogo } from "../Logo";
import { HeaderDrawer } from "./HeaderDrawer";

interface HeaderProps {
  public?: boolean;
  user?: any;
  isTrial?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  public: isPublic = false,
  user,
  isTrial = false,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 max-w-7xl mx-auto">
      <div className="px-0 mx-auto bg-theme-background/80 backdrop-blur-md rounded-b-xl border-theme-border/20">
        <div className="flex items-center h-14 sm:px-4 px-2 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 w-full justify-between">
            <div className="min-w-0">
              <CasaBoardLogo
                variant="dark"
                size="small"
                className="max-w-fit"
              />
            </div>
            <button
              className="p-2 ml-1 rounded-md border border-theme-border text-theme-text"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Icon path={mdiMenu} className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <HeaderDrawer
        isOpen={menuOpen}
        onOpenChange={setMenuOpen}
        isPublic={isPublic}
        user={user}
        isTrial={isTrial}
      />
    </header>
  );
};
