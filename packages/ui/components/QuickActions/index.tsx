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
import { cn } from '@heroui/react';
import type { Entitlements } from '@repo/types/subscription';
import { useMergedHAInstances } from '@repo/hooks';

interface QuickAction {
  href: string;
  icon: string;
  title: string;
  description: string;
  disabled?: boolean;
  disabledReason?: string;
}

export interface QuickActionsProps {
  entitlements: Entitlements;
}

export const QuickActions = ({ entitlements }: QuickActionsProps) => {
  const router = useRouter();
  const { instances: haInstances } = useMergedHAInstances(entitlements);

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
    <Card className="w-full bg-white border border-slate-100 shadow-sm">
      <CardHeader className="flex flex-col gap-1 pb-2">
        <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
        <p className="text-sm text-slate-500">Common tasks and shortcuts</p>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Card
              key={action.href}
              className={cn(
                "group cursor-pointer transition-all duration-200 border-none shadow-none",
                action.disabled
                  ? "bg-slate-50 cursor-not-allowed opacity-60"
                  : "bg-slate-50 hover:bg-violet-50 hover:shadow-sm"
              )}
              isPressable={!action.disabled}
              onPress={() => handleActionClick(action)}
            >
              <CardBody className="p-4">
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Icon */}
                  <div className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center transition-colors",
                    action.disabled
                      ? "bg-slate-100"
                      : "bg-violet-50 group-hover:bg-violet-100"
                  )}>
                    <Icon
                      path={action.icon}
                      className={cn(
                        "w-5 h-5 transition-colors",
                        action.disabled
                          ? "text-slate-400"
                          : "text-violet-600"
                      )}
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-0.5">
                    <h3 className={cn(
                      "font-semibold text-sm",
                      action.disabled
                        ? "text-slate-400"
                        : "text-slate-900 group-hover:text-violet-700"
                    )}>
                      {action.title}
                    </h3>
                    <p className={cn(
                      "text-xs",
                      action.disabled
                        ? "text-slate-400"
                        : "text-slate-500"
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
                      className="w-4 h-4 text-slate-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all"
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
