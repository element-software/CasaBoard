"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardBody, Button, Divider, Drawer, DrawerContent, DrawerBody, useDisclosure } from "@heroui/react";
import Icon from "@mdi/react";
import {
  mdiViewDashboard,
  mdiCog,
  mdiHome,
  mdiMenu,
  mdiChevronDown,
  mdiChevronRight,
  mdiAccount,
  mdiInformation,
  mdiBookOpen,
  mdiCreditCard,
} from "@mdi/js";
import { cn } from "@heroui/react";
import { CasaBoardLogo } from "../Logo";
import { LinkService } from "@repo/lib";
import { UserMenu } from "../Header/UserMenu";

interface SetupSidebarProps {
  className?: string;
  user: any;
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export const SetupSidebar = ({ 
  className, 
  user, 
  isOpen = true, 
  onClose, 
  isMobile = false 
}: SetupSidebarProps) => {
  const pathname = usePathname();
  const { isOpen: drawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const [isMobileView, setIsMobileView] = useState(false);
  
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["screens", "manage"])
  );

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navigationItems = [
    {
      id: "screens",
      title: "Screens",
      icon: mdiViewDashboard,
      items: [
        {
          title: "Pages",
          href: "/setup/pages",
          icon: mdiHome,
        },
        {
          title: "Sidebars",
          href: "/setup/sidebars",
          icon: mdiMenu,
        },
      ],
    },
    {
      id: "manage",
      title: "Manage",
      icon: mdiCog,
      items: [
        {
          title: "HA Instances",
          href: "/setup/ha-config",
          icon: mdiHome,
        },
        {
          title: "Billing",
          href: "/auth/profile/billing",
          icon: mdiCreditCard,
        },
        {
          title: "Profile",
          href: "/auth/profile",
          icon: mdiAccount,
        },
      ],
    },
  ];

  const bottomItems = [
    {
      title: "About",
      href: LinkService.crossAppHref("public", "/about"),
      icon: mdiInformation,
    },
    {
      title: "Docs",
      href: LinkService.crossAppHref("public", "/docs"),
      icon: mdiBookOpen,
    },
  ];

  const renderSidebarContent = () => (
    <div className="h-full flex flex-col text-white">
      {/* Logo */}
      <div className="p-6 border-b border-white">
        <CasaBoardLogo variant="dark" />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4 space-y-2">
          {navigationItems.map((section) => (
            <div key={section.id}>
              <Button
                variant="light"
                className="w-full justify-start text-left font-semibold text-sm text-white hover:bg-theme-primary"
                onPress={() => toggleSection(section.id)}
                startContent={
                  <Icon path={section.icon} className="w-4 h-4 text-white" />
                }
                endContent={
                  <Icon
                    path={
                      expandedSections.has(section.id)
                        ? mdiChevronDown
                        : mdiChevronRight
                    }
                    className="w-4 h-4 text-white"
                  />
                }
              >
                {section.title}
              </Button>

              {expandedSections.has(section.id) && (
                <div className="ml-6 gap-1 mt-1 flex flex-col">
                  {section.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={isMobileView ? onDrawerClose : undefined}>
                      <Button
                        variant="light"
                        className={cn(
                          "w-full justify-start text-left text-sm text-white hover:bg-theme-primary",
                          isActive(item.href) &&
                            "bg-theme-primary text-white hover:bg-theme-primary"
                        )}
                        startContent={
                          <Icon
                            path={item.icon}
                            className="w-4 h-4 text-white"
                          />
                        }
                      >
                        {item.title}
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <Divider className="mx-4" />

        {/* Bottom Items */}
        <div className="p-4 space-y-1">
          {bottomItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={isMobileView ? onDrawerClose : undefined}>
              <Button
                variant="light"
                className={cn(
                  "w-full justify-start text-left text-sm text-white hover:bg-theme-primary",
                  isActive(item.href) &&
                    "bg-theme-primary text-white hover:bg-theme-primary"
                )}
                startContent={
                  <Icon path={item.icon} className="w-4 h-4 text-white" />
                }
              >
                {item.title}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4">
        <UserMenu user={user} />
      </div>
    </div>
  );

  // Mobile drawer
  if (isMobileView) {
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          isIconOnly
          variant="light"
          className="fixed top-2 left-2 z-50 md:hidden"
          onPress={onDrawerOpen}
        >
          <Icon path={mdiMenu} className="w-5 h-5" />
        </Button>

        {/* Mobile Drawer */}
        <Drawer 
          isOpen={drawerOpen} 
          onClose={onDrawerClose} 
          placement="left" 
          size="sm"
          className="md:hidden"
        >
          <DrawerContent>
            <DrawerBody className="p-0">
              {renderSidebarContent()}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // Desktop sidebar
  return (
    <Card
      className={cn(
        "h-screen w-96 text-white border-r rounded-none",
        className
      )}
    >
      <CardBody className="p-0 h-full">
        {renderSidebarContent()}
      </CardBody>
    </Card>
  );
};
