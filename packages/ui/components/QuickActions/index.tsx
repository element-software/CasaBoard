"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@mdi/react';
import { Card, CardHeader, CardBody, Button, Chip } from '@heroui/react';
import { 
  mdiPlus, 
  mdiWeb, 
  mdiHomeAssistant,
  mdiCreditCard,
  mdiAlertCircle,
  mdiArrowRight
} from '@mdi/js';
import { HAInstance as HAInstanceType } from '@repo/types/ha';
import { cn } from '@heroui/react';

interface QuickAction {
  href: string;
  icon: string;
  title: string;
  description: string;
  disabled?: boolean;
  disabledReason?: string;
}

export interface QuickActionsProps {
  haInstances: HAInstanceType[];
}

export const QuickActions = ({ haInstances }: QuickActionsProps) => {
  const router = useRouter();

  const quickActions: QuickAction[] = [
    {
      href: '/setup/pages/create',
      icon: mdiPlus,
      title: 'Create Page',
      description: 'New dashboard page',
      disabled: haInstances.length === 0,
      disabledReason: 'Add a Home Assistant instance first'
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
      href: '/auth/profile/billing',
      icon: mdiCreditCard,
      title: 'Billing',
      description: 'Manage your billing'
    }
  ];

  const handleActionClick = (action: QuickAction) => {
    if (action.disabled) {
      if (action.href === '/setup/pages/create') {
        router.push('/setup/ha-config');
      }
      return;
    }
    router.push(action.href);
  };

  return (
    <Card className="w-full bg-theme-surface/50 backdrop-blur-sm border border-secondary">
      <CardHeader className="pb- flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-theme-text">Quick Actions</h2>
        <p className="text-sm text-theme-text-secondary">Common tasks and shortcuts</p>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Card
              key={action.href}
              className={cn(
                "group cursor-pointer transition-all duration-200 hover:shadow-md",
                action.disabled 
                  ? "bg-theme-background/50 border-dashed border-secondary/50 cursor-not-allowed" 
                  : "bg-theme-background border-secondary hover:border-theme-primary/30 hover:bg-theme-primary/5"
              )}
              isPressable={!action.disabled}
              onPress={() => handleActionClick(action)}
            >
              <CardBody className="p-4">
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                    action.disabled 
                      ? "bg-theme-text-secondary/10" 
                      : "bg-theme-primary/10 group-hover:bg-theme-primary/20"
                  )}>
                    <Icon 
                      path={action.icon} 
                      className={cn(
                        "w-6 h-6 transition-colors",
                        action.disabled 
                          ? "text-theme-text-secondary/50" 
                          : "text-theme-primary group-hover:text-theme-primary"
                      )} 
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-1">
                    <h3 className={cn(
                      "font-medium text-sm",
                      action.disabled 
                        ? "text-theme-text-secondary/60" 
                        : "text-theme-text group-hover:text-theme-primary"
                    )}>
                      {action.title}
                    </h3>
                    <p className={cn(
                      "text-xs",
                      action.disabled 
                        ? "text-theme-text-secondary/40" 
                        : "text-theme-text-secondary"
                    )}>
                      {action.description}
                    </p>
                  </div>

                  {/* Status */}
                  {action.disabled ? (
                    <div className="flex items-center gap-1">
                      <Icon path={mdiAlertCircle} className="w-3 h-3 text-warning" />
                      <Chip size="sm" color="warning" variant="flat" className="text-xs">
                        {action.disabledReason}
                      </Chip>
                    </div>
                  ) : (
                    <Icon 
                      path={mdiArrowRight} 
                      className="w-4 h-4 text-theme-text-secondary/60 group-hover:text-theme-primary group-hover:translate-x-1 transition-all" 
                    />
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
