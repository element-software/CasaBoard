"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@mdi/react";
import {
  mdiHome,
  mdiPlayBox,
  mdiCctv,
  mdiChartBar,
  mdiCircle,
} from "@mdi/js";
import classNames from "classnames";

export type SidebarNavItem = {
  label: string;
  pageSlug: string;
  icon?: string;
};

export type SidebarNavProps = {
  items?: SidebarNavItem[];
};

const ICON_MAP: Record<string, string> = {
  home: mdiHome,
  media: mdiPlayBox,
  cameras: mdiCctv,
  insights: mdiChartBar,
  play: mdiPlayBox,
  camera: mdiCctv,
  chart: mdiChartBar,
};

function resolveIcon(icon?: string, slug?: string): string {
  if (icon && ICON_MAP[icon.toLowerCase()]) return ICON_MAP[icon.toLowerCase()];
  if (icon && icon.startsWith("M")) return icon; // raw MDI path
  if (slug && ICON_MAP[slug.toLowerCase()]) return ICON_MAP[slug.toLowerCase()];
  return mdiCircle;
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();
  const navItems =
    items && items.length > 0
      ? items
      : [
          { label: "Home", pageSlug: "home", icon: "home" },
          { label: "Media", pageSlug: "media", icon: "media" },
          { label: "Cameras", pageSlug: "cameras", icon: "cameras" },
          { label: "Insights", pageSlug: "insights", icon: "insights" },
        ];

  return (
    <nav className="flex flex-col gap-1 w-full" aria-label="Dashboard">
      {navItems.map((item) => {
        const href = `/dashboard/${item.pageSlug}`;
        const active =
          pathname === href ||
          pathname?.endsWith(`/dashboard/${item.pageSlug}`);
        const path = resolveIcon(item.icon, item.pageSlug);

        return (
          <Link
            key={item.pageSlug}
            href={href}
            className={classNames(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-theme-interactive-active text-theme-text"
                : "text-theme-text-secondary hover:bg-theme-interactive-hover hover:text-theme-text"
            )}
          >
            <span
              className={classNames(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                active ? "bg-theme-text text-theme-page-background" : "bg-theme-interactive-hover"
              )}
            >
              <Icon path={path} className="h-4 w-4" />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default SidebarNav;
