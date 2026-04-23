"use client";

import type { CSSProperties } from "react";
import { Render } from "@measured/puck";
import { Page } from "@repo/types/page";
import { PuckConfig } from "./puck.config";
import {
  Drawer,
  DrawerContent,
  DrawerBody,
  Button,
} from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiMenu } from "@mdi/js";
import { useState, useEffect } from "react";
import { ThemeScope } from "../ThemeScope/ThemeScope";

interface PuckRendererProps {
  pageId: string;
  pageData?: Page;
  themeMainStyle?: CSSProperties;
  themeSidebarStyle?: CSSProperties;
}

export const PuckRenderer = ({
  pageId,
  pageData,
  themeMainStyle,
  themeSidebarStyle,
}: PuckRendererProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!pageData) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error loading page: {pageId}</p>
      </div>
    );
  }

  if (!pageData?.puck_data) {
    return (
      <ThemeScope style={themeMainStyle} className="min-h-screen bg-theme-page-background">
        <div className="p-8 text-center text-theme-text-secondary">
          <p>This page hasn&apos;t been configured yet.</p>
          <p>Use the setup editor to add components to this page.</p>
        </div>
      </ThemeScope>
    );
  }

  const hasSidebar = pageData.sidebar && pageData.sidebar.puck_data;

  const renderSidebarPuck = () => {
    if (!hasSidebar) return null;

    try {
      return (
        <Render config={PuckConfig} data={pageData.sidebar!.puck_data} />
      );
    } catch (error) {
      console.error("Error rendering sidebar:", error);
      return (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>
            Error rendering sidebar:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      );
    }
  };

  const renderDesktopSidebar = () => {
    if (!hasSidebar) return null;

    return (
      <ThemeScope
        style={themeSidebarStyle}
        className="min-w-[300px] max-w-[300px] h-screen p-4 hidden md:block bg-theme-background"
      >
        {renderSidebarPuck()}
      </ThemeScope>
    );
  };

  const renderMobileDrawer = () => {
    if (!hasSidebar) return null;

    return (
      <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="sm">
        <DrawerContent>
          <DrawerBody className="p-4 bg-theme-background">
            <ThemeScope style={themeSidebarStyle}>
              {renderSidebarPuck()}
            </ThemeScope>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  };

  const renderMobileToggle = () => {
    if (!hasSidebar || !isMobile) return null;

    return (
      <div className="md:hidden pb-2">
        <Button
          isIconOnly
          variant="light"
          onPress={onOpen}
          aria-label="Open sidebar"
        >
          <Icon path={mdiMenu} className="w-5 h-5" />
        </Button>
      </div>
    );
  };

  return (
    <ThemeScope
      style={themeMainStyle}
      className="min-h-screen bg-theme-page-background text-theme-text"
    >
      <div className="flex flex-col md:flex-row gap-4 relative">
        {renderDesktopSidebar()}
        {renderMobileDrawer()}
        <div className="p-4 pt-0 md:pt-4 w-full grow">
          {renderMobileToggle()}
          <Render config={PuckConfig} data={pageData.puck_data} />
        </div>
      </div>
    </ThemeScope>
  );
};
