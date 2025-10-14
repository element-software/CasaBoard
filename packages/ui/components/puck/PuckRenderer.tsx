"use client";

import { Render } from "@measured/puck";
import { Page } from "@repo/types/page";
import { PuckConfig } from "./puck.config";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, Button } from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiMenu } from "@mdi/js";
import { useState, useEffect } from "react";
interface PuckRendererProps {
  pageId: string;
  pageData?: Page;
}

export const PuckRenderer = ({ pageId, pageData }: PuckRendererProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!pageData) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error loading page: {pageId}</p>
      </div>
    );
  }

  // If no page found or no Puck data, show fallback
  if (!pageData?.puck_data) {
    return (
      <div className="p-8 text-center text-theme-text-secondary">
        <p>This page hasn&apos;t been configured yet.</p>
        <p>Use the setup editor to add components to this page.</p>
      </div>
    );
  }

  const hasSidebar = pageData.sidebar && pageData.sidebar.puck_data;

  const renderSidebarContent = () => {
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
      <div className="min-w-[300px] h-screen p-4 hidden md:block">
        {renderSidebarContent()}
      </div>
    );
  };

  const renderMobileDrawer = () => {
    if (!hasSidebar) return null;
    
    return (
      <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="sm">
        <DrawerContent>
          <DrawerBody className="p-4">
            {renderSidebarContent()}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  };

  const renderMobileToggle = () => {
    if (!hasSidebar || !isMobile) return null;
    
    return (
      <Button
        isIconOnly
        variant="light"
        className="fixed top-4 left-4 z-50 md:hidden"
        onPress={onOpen}
      >
        <Icon path={mdiMenu} className="w-5 h-5" />
      </Button>
    );
  };

  return (
    <div className="flex flex-row gap-4 relative">
      {renderDesktopSidebar()}
      {renderMobileDrawer()}
      {renderMobileToggle()}
      <div className="p-4 w-full grow">
        <Render config={PuckConfig} data={pageData.puck_data} />
      </div>
    </div>
  );
};
