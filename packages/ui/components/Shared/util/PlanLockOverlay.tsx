"use client";
import { Button, Card, CardBody } from "@heroui/react";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiLock, mdiArrowRight } from "@mdi/js";

const BILLING_HREF = "/auth/profile/billing";

/** Full-page lock — used when navigating directly to a locked dashboard. */
export function PlanLockPage({ name }: { name?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-theme-background">
      <Card className="w-full max-w-md border-none shadow-large">
        <CardBody className="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
            <Icon path={mdiLock} className="w-8 h-8 text-slate-400" />
          </div>
          {name && (
            <p className="text-xs font-mono text-slate-400 truncate">/{name}</p>
          )}
          <h2 className="text-xl font-semibold text-theme-text">
            Upgrade to view this content
          </h2>
          <p className="text-sm text-theme-text-secondary">
            This is outside your free plan allowance. Upgrade your plan to
            access it again, or delete it to free up space.
          </p>
          <Button
            as={Link}
            href={BILLING_HREF}
            color="primary"
            endContent={<Icon path={mdiArrowRight} className="w-4 h-4" />}
          >
            Upgrade plan
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

/** Inline card lock — replaces an item card in list views. */
export function PlanLockCard({
  name,
  compact = false,
}: {
  name: string;
  compact?: boolean;
}) {
  return (
    <Card className="border-dashed border-2 border-slate-200">
      <CardBody className={compact ? "p-3" : "p-4"}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon path={mdiLock} className="w-4 h-4 text-slate-400" />
            </div>
            <div className="min-w-0">
              <p
                className={`font-medium text-slate-400 line-through truncate ${compact ? "text-sm" : ""}`}
              >
                {name}
              </p>
              <p className="text-xs text-slate-400">
                Outside free plan allowance
              </p>
            </div>
          </div>
          <Button
            as={Link}
            href={BILLING_HREF}
            size="sm"
            color="primary"
            variant="flat"
            className="flex-shrink-0"
            endContent={<Icon path={mdiArrowRight} className="w-3 h-3" />}
          >
            Upgrade
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
