"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  Button,
  Divider,
  Drawer,
  DrawerContent,
  DrawerBody,
  useDisclosure,
} from "@heroui/react";
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
  isOpen = false,
  onClose,
  isMobile = false,
}: SetupSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
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
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
      id: "dashboard",
      title: "Dashboard",
      icon: mdiViewDashboard,
      href: "/setup",
      selfClick: true,
    },
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
    <div className="h-full flex flex-col bg-white">
      {/* Logo */}
      <div className="p-4 border-b border-slate-100 flex flex-row items-center justify-start gap-2">
        <CasaBoardLogo size="medium" />
        <span className="text-slate-900 text-lg font-semibold tracking-tight">CasaBoard</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="p-3 space-y-1">
          {navigationItems.map((section) => (
            <div key={section.id}>
              <Button
                variant="light"
                className="w-full justify-start text-left font-semibold text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                onPress={() =>
                  section.selfClick
                    ? router.push(section.href)
                    : toggleSection(section.id)
                }
                startContent={
                  <Icon path={section.icon} className="w-4 h-4 text-slate-400" />
                }
                endContent={
                  <Icon
                    path={
                      section.selfClick
                        ? mdiChevronRight
                        : expandedSections.has(section.id)
                          ? mdiChevronDown
                          : mdiChevronRight
                    }
                    className="w-4 h-4 text-slate-400"
                  />
                }
              >
                {section.title}
              </Button>

              {!section.selfClick && expandedSections.has(section.id) && (
                <div className="ml-6 gap-0.5 mt-0.5 flex flex-col">
                  {section.items?.map((item) => (
                    <Button
                      key={item.href}
                      variant="light"
                      className={cn(
                        "w-full justify-start text-left text-sm text-slate-600 hover:bg-violet-50 hover:text-violet-700",
                        isActive(item.href) &&
                          "bg-violet-100 text-violet-700 hover:bg-violet-100"
                      )}
                      startContent={
                        <Icon
                          path={item.icon}
                          className={cn(
                            "w-4 h-4 text-slate-400",
                            isActive(item.href) && "text-violet-600"
                          )}
                        />
                      }
                      onPress={() => {
                        router.push(item.href);
                        if (isMobileView && onClose) onClose();
                      }}
                    >
                      {item.title}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <Divider className="mx-4" />

        {/* Bottom Items */}
        <div className="p-3 space-y-0.5">
          {bottomItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobileView && onClose ? onClose : undefined}
            >
              <Button
                variant="light"
                className={cn(
                  "w-full justify-start text-left text-sm text-slate-600 hover:bg-violet-50 hover:text-violet-700",
                  isActive(item.href) && "bg-violet-100 text-violet-700"
                )}
                startContent={
                  <Icon path={item.icon} className="w-4 h-4 text-slate-400" />
                }
              >
                {item.title}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-100">
        <UserMenu user={user} />
      </div>
    </div>
  );

  // Mobile drawer
  if (isMobileView) {
    return (
      <Drawer
        isOpen={isOpen}
        onClose={onClose || (() => {})}
        placement="left"
        size="sm"
        className="md:hidden"
      >
        <DrawerContent>
          <DrawerBody className="p-0">{renderSidebarContent()}</DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop sidebar
  return (
    <Card
      className={cn(
        "h-screen w-96 border-r border-slate-100 rounded-none bg-white shadow-none",
        className
      )}
    >
      <CardBody className="p-0 h-full">{renderSidebarContent()}</CardBody>
    </Card>
  );
};

// Export a separate mobile menu button component that can be used inline
export const MobileMenuButton = ({
  onOpen,
}: {
  onOpen: () => void;
}) => {
  return (
    <Button
      isIconOnly
      variant="light"
      className="md:hidden"
      onPress={onOpen}
      aria-label="Open menu"
    >
      <Icon path={mdiMenu} className="w-5 h-5" />
    </Button>
  );
};
