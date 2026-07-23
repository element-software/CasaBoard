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
  mdiChevronRight,
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
    <nav className="flex flex-col gap-1.5 w-full mt-2" aria-label="Dashboard">
      {navItems.map((item) => {
        const href = `/dashboard/${item.pageSlug}`;
        const active =
          pathname === href ||
          pathname?.endsWith(`/dashboard/${item.pageSlug}`);
        const path = resolveIcon(item.icon, item.pageSlug);
        const showChevron = item.pageSlug === "media";

        return (
          <Link
            key={item.pageSlug}
            href={href}
            className={classNames(
              "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[15px] font-semibold transition-colors",
              active
                ? "bg-theme-interactive-active text-theme-text-on"
                : "text-theme-text-secondary hover:bg-theme-interactive-hover hover:text-theme-text"
            )}
          >
            <Icon path={path} className="h-5 w-5 shrink-0 opacity-90" />
            <span className="flex-1 truncate">{item.label}</span>
            {showChevron && !active && (
              <Icon
                path={mdiChevronRight}
                className="h-4 w-4 shrink-0 opacity-50"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default SidebarNav;
