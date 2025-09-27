"use client";
import Icon from '@mdi/react';
import { mdiChevronRight, mdiHome, mdiCog, mdiInformation, mdiWeb, mdiAccount } from '@mdi/js';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
}

export const Breadcrumbs = ({ items = [], showHome = true }: BreadcrumbsProps) => {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname if no items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add home breadcrumb if enabled and not on home page
    if (showHome && pathname !== '/') {
      breadcrumbs.push({
        label: 'Home',
        href: '/',
        icon: mdiHome
      });
    }

    // Handle public pages
    if (pathname === '/about') {
      breadcrumbs.push({
        label: 'About',
        icon: mdiInformation
      });
    } else if (pathname === '/instructions') {
      breadcrumbs.push({
        label: 'Instructions',
        icon: mdiInformation
      });
    }
    // Handle authenticated pages
    else if (pathname.startsWith('/setup')) {
      breadcrumbs.push({
        label: 'Setup',
        href: '/setup',
        icon: mdiCog
      });

      // Add specific setup page breadcrumbs
      if (pathname.startsWith('/setup/pages')) {
        breadcrumbs.push({
          label: 'Pages',
          href: '/setup/pages'
        });
      } else if (pathname.startsWith('/setup/pages/create')) {
        breadcrumbs.push(
          { label: 'Pages', href: '/setup/pages' },
          { label: 'Create Page' }
        );
      } else if (pathname.startsWith('/setup/pages/edit/')) {
        const pageSlug = pathname.split('/').pop();
        breadcrumbs.push(
          { label: 'Pages', href: '/setup/pages' },
          { label: `Edit ${pageSlug || 'Page'}` }
        );
      } else if (pathname.startsWith('/setup/ha-config')) {
        breadcrumbs.push({
          label: 'HA Configuration'
        });
      }
    } else if (pathname.startsWith('/auth/')) {
      if (pathname === '/auth/login') {
        breadcrumbs.push({
          label: 'Login',
          icon: mdiAccount
        });
      } else if (pathname === '/auth/callback') {
        breadcrumbs.push({
          label: 'Authentication',
          icon: mdiAccount
        });
      }
    }
    // Handle dynamic pages (user-created pages)
    else if (pathSegments.length === 1 && pathSegments[0] !== 'about' && pathSegments[0] !== 'instructions') {
      const pageName = pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1).replace(/-/g, ' ');
      breadcrumbs.push({
        label: pageName,
        icon: mdiWeb
      });
    }

    return breadcrumbs;
  };

  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs();

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-theme-text">
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <Icon path={mdiChevronRight} className="h-4 w-4 text-theme-text-secondary" />
          )}
          
          {item.href ? (
            <Link
              href={item.href}
              className="flex items-center gap-1 hover:text-theme-accent transition-colors"
            >
              {item.icon && <Icon path={item.icon} className="h-4 w-4" />}
              <span>{item.label}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-1">
              {item.icon && <Icon path={item.icon} className="h-4 w-4" />}
              <span className="font-medium">{item.label}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
