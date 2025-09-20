"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SupabaseClient } from "@repo/lib";
import { Breadcrumbs } from "@repo/ui/components/Setup/Breadcrumbs";
import Icon from "@mdi/react";
import {
  mdiAccount,
  mdiLogout,
  mdiChevronDown,
  mdiCog,
  mdiInformation,
} from "@mdi/js";
import { CasaBoardLogo } from "../Logo";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/react";
import Link from "next/link";
import { LinkService } from "@repo/lib";
import { mdiMenu } from "@mdi/js";

// User Menu Component
function UserMenu({
  user,
}: {
  user: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const supabase = SupabaseClient.createClient();

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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-theme-text bg-theme-background border border-theme-border rounded-lg hover:bg-theme-secondary transition-colors"
      >
        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-theme-background rounded-full flex items-center justify-center border border-primary">
          <span className="text-xs font-medium text-theme-text-primary">
            {user.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="font-medium max-w-20 sm:max-w-32 truncate hidden sm:inline">
          {user.email}
        </span>
        <Icon
          path={mdiChevronDown}
          className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-theme-background rounded-full flex items-center justify-center border border-primary">
                  <span className="text-xs sm:text-sm font-medium text-theme-text-primary">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-theme-text text-sm truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-theme-text-secondary">
                    Smart Home User
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-3">
              <Button
                as={Link}
                color="primary"
                href="/setup"
                className="text-white font-medium"
              >
                Setup Dashboard
                <Icon path={mdiCog} className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                as={Link}
                variant="bordered"
                color="primary"
                href="/about"
                className="text-theme-text-primary font-medium"
              >
                About
                <Icon path={mdiInformation} className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                as={Link}
                variant="bordered"
                color="primary"
                href="/auth/profile"
                className="text-theme-text-primary"
              >
                Profile
                <Icon path={mdiAccount} className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>

            <div className="p-2">
              <Button
                onPress={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 text-xs sm:text-sm text-white hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                variant="solid"
                color="danger"
              >
                <Icon
                  path={mdiLogout}
                  className="h-3 w-3 sm:h-4 sm:w-4 text-white"
                />
                {isLoggingOut ? "Logging out..." : "Sign out"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface HeaderProps {
  public?: boolean;
  user?: any;
}

export const Header: React.FC<HeaderProps> = ({ public: isPublic = false, user }) => {
  const pathname = usePathname();
  const hideBreadcrumbs = isPublic && pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const publicLinks = [
    { href: LinkService.crossAppHref("public", "/about"), label: "About", external: true },
    { href: "https://app.casaboard.dev", label: "Login", external: true },
    { href: "https://demo.casaboard.dev", label: "View Demo", external: true },
  ];
  return (
    <header className="sticky top-0 z-30 bg-theme-background/80 backdrop-blur-md border-b border-r border-l rounded-b-xl border-theme-border/20 max-w-7xl mx-auto">
      <div className="px-0 mx-auto">
        <div className="flex items-center h-14 sm:px-4 px-2 sm:h-16">
          {/* Left side - Mobile Menu and Logo */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 w-full justify-between">
            <div className="min-w-0">
              <CasaBoardLogo
                variant="dark"
                size="small"
                className="max-w-fit"
              />
            </div>
            {/* Mobile burger */}
            {isPublic && (
              <div className="sm:hidden flex items-center gap-2">
                <Button
                  as={Link}
                  color="primary"
                  href="https://app.casaboard.dev"
                  className="text-white font-medium"
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  variant="bordered"
                  color="primary"
                  href="https://demo.casaboard.dev"
                  className="text-theme-text-primary"
                >
                  View Demo
                </Button>
                <button
                  className="sm:hidden p-2 ml-1 rounded-md border border-theme-border text-theme-text self-end"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <Icon path={mdiMenu} className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Right side - User Menu (only show if not public) */}
          {!isPublic ? (
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-auto">
              <UserMenu user={user} />
            </div>
          ) : (
            <div className="items-center gap-2 flex-shrink-0 ml-auto hidden sm:flex">
              <Button
                as={Link}
                variant="light"
                href={LinkService.crossAppHref("public", "/about")}
                className="text-theme-text"
              >
                About
              </Button>
              <Button
                as={Link}
                color="primary"
                href="https://app.casaboard.dev"
                className="text-white font-medium"
              >
                Login
              </Button>
              <Button
                as={Link}
                variant="bordered"
                color="primary"
                href={LinkService.crossAppHref("public", "/about")}
                className="text-theme-text-primary"
              >
                About
              </Button>
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

      {/* Mobile drawer for public header */}
      {isPublic && (
        <Drawer isOpen={menuOpen} onOpenChange={setMenuOpen} placement="right">
          <DrawerContent className="bg-theme-background text-theme-text border-r border-theme-border">
            <DrawerHeader className="border-b border-theme-border">
              Menu
            </DrawerHeader>
            <DrawerBody className="flex flex-col gap-2">
              {publicLinks.map((link) => (
                <Button
                  key={link.href}
                  as={Link}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  variant="light"
                  className="justify-start text-theme-text"
                  onPress={() => setMenuOpen(false)}
                >
                  {link.label}
                </Button>
              ))}
            </DrawerBody>
            <DrawerFooter />
          </DrawerContent>
        </Drawer>
      )}
    </header>
  );
};
