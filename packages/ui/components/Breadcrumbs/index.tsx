"use client";

import {
  BreadcrumbItem,
  Breadcrumbs as HeroBreadcrumbs,
  Skeleton,
} from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Crumb = { label: string; href?: string };

interface BreadcrumbsProps {
  showHome?: boolean;
  startContent?: React.ReactNode;
}

export const Breadcrumbs = ({ showHome = true, startContent }: BreadcrumbsProps) => {
  const pathname = usePathname() || "/";
  // Generate breadcrumbs from pathname with simple, declarative rules
  const generateBreadcrumbs = (): Crumb[] => {
    const segments = (pathname || "/").split("/").filter(Boolean);
    const labelMap: Record<string, string> = {
      setup: "Setup",
      pages: "Pages",
      "ha-config": "HA Configuration",
      auth: "Authentication",
      login: "Login",
      billing: "Billing",
      profile: "Profile",
      about: "About",
      create: "Create",
      edit: "Edit",
    };

    const toTitle = (s: string) =>
      s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    const crumbs: Crumb[] = [];
    if (showHome && pathname !== "/") crumbs.push({ label: "Home", href: "/" });

    let acc = "";
    for (let i = 0; i < segments.length; i++) {
      const seg = decodeURIComponent(segments[i]);
      console.log("seg:", seg);

      // Special case: edit/<slug> -> "Edit <Slug>"
      if (seg === "edit" && i + 1 < segments.length) {
        const slug = decodeURIComponent(segments[i + 1]);
        acc += `/${seg}/${slug}`;
        const isLast = i + 1 === segments.length - 1;
        crumbs.push({
          label: `Edit ${toTitle(slug)}`,
          href: isLast ? undefined : acc,
        });
        i++; // skip slug segment
        continue;
      }

      acc += `/${seg}`;
      const isLast = i === segments.length - 1;
      const label = labelMap[seg] ?? toTitle(seg);
      crumbs.push({ label, href: isLast ? undefined : acc });
    }

    return crumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();
  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <Skeleton isLoaded={breadcrumbItems.length > 0}>
      <div className="max-w-7xl w-full mx-auto pt-4.5 pb-2 md:pt-4 md:pb-4 flex items-center gap-2">
        {startContent && <div className="md:hidden">{startContent}</div>}
        <HeroBreadcrumbs className="text-sm">
          {breadcrumbItems.map((item, index) => {
            if (item.href !== "/auth")
              return (
                <BreadcrumbItem key={`${item.label}-${index}`}>
                  {item.href ? (
                    <Link href={item.href}>{item.label}</Link>
                  ) : (
                    item.label
                  )}
                </BreadcrumbItem>
              );
          })}
        </HeroBreadcrumbs>
      </div>
    </Skeleton>
  );
};
