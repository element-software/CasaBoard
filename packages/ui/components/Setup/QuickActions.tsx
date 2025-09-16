"use client";
import Link from 'next/link';
import Icon from '@mdi/react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import { 
  mdiPlus, 
  mdiHome, 
  mdiWeb, 
  mdiHomeAssistant,
  mdiCreditCard
} from '@mdi/js';

interface QuickAction {
  href: string;
  icon: string;
  title: string;
  description: string;
}

const quickActions: QuickAction[] = [
  {
    href: '/setup/pages/create',
    icon: mdiPlus,
    title: 'Create Page',
    description: 'New dashboard page'
  },
  {
    href: '/setup/pages',
    icon: mdiWeb,
    title: 'All Pages',
    description: 'Manage all pages'
  },
  {
    href: '/setup/ha-config',
    icon: mdiHomeAssistant,
    title: 'HA Settings',
    description: 'Configure HA'
  },
  {
    href: '/billing',
    icon: mdiCreditCard,
    title: 'Billing',
    description: 'Manage your billing'
  }
];

export const QuickActions = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-lg font-semibold text-theme-text">Quick Actions</h2>
      </CardHeader>
      <CardBody>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center p-4 bg-theme-background rounded-lg border border-theme-border hover:bg-theme-primary text-theme-text-primary transition-colors group"
            >
              <Icon path={action.icon} className="w-6 h-6 mr-3 text-theme-text-secondary group-hover:text-theme-text-primary" />
              <div>
                <h3 className="font-medium">{action.title}</h3>
                <p className="text-sm text-theme-text-secondary group-hover:text-theme-text-primary/70">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
