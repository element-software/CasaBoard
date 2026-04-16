"use client";
import { Button, Card, CardBody } from "@heroui/react";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiAlertCircleOutline } from "@mdi/js";

interface SubscriptionLapseBannerProps {
  /** When true the entire page is blocked (no children rendered) */
  fullBlock?: boolean;
  children?: React.ReactNode;
}

/**
 * Shown when a paid-tier user's subscription has lapsed.
 * Does NOT hard-block access — it renders children in read-only context
 * and shows a persistent top banner directing the user to upgrade or
 * switch to the free local tier.
 */
export function SubscriptionLapseBanner({
  fullBlock = false,
  children,
}: SubscriptionLapseBannerProps) {
  const banner = (
    <div className="w-full bg-warning/10 border-b border-warning/30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Icon path={mdiAlertCircleOutline} className="w-5 h-5 text-warning flex-shrink-0" />
          <p className="text-sm text-foreground-700">
            <span className="font-semibold">Your subscription has lapsed.</span>{" "}
            Your dashboards are now <span className="font-semibold">read-only</span>.
            Upgrade to restore full access, or switch to the free local tier.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            as={Link}
            href="/auth/profile/billing"
            size="sm"
            color="warning"
            variant="solid"
          >
            Upgrade
          </Button>
          <Button
            as={Link}
            href="/auth/profile?tab=storage"
            size="sm"
            color="default"
            variant="bordered"
          >
            Switch to Local (Free)
          </Button>
        </div>
      </div>
    </div>
  );

  if (fullBlock) {
    return (
      <div className="min-h-screen flex flex-col">
        {banner}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-2xl border-none shadow-large">
            <CardBody className="p-8 sm:p-10 text-center space-y-4">
              <Icon path={mdiAlertCircleOutline} className="w-12 h-12 text-warning mx-auto" />
              <h1 className="text-2xl font-semibold">Subscription required</h1>
              <p className="text-foreground-500">
                Your free trial has ended or your subscription is inactive.
                Choose a plan to continue using CasaBoard cloud features,
                or switch to the free local tier.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Button as={Link} href="/auth/profile/billing" color="primary">
                  View plans
                </Button>
                <Button
                  as={Link}
                  href="/auth/profile?tab=storage"
                  color="default"
                  variant="bordered"
                >
                  Switch to Local (Free)
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      {banner}
      {children}
    </>
  );
}
