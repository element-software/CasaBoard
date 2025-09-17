"use client";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiCheckCircleOutline } from "@mdi/js";

export default function SuccessContent({
  planLabel,
  currentPeriodEnd,
}: {
  planLabel: string | null;
  currentPeriodEnd: string | null;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <Card className="bg-theme-surface/60 backdrop-blur border border-theme-border shadow-xl">
        <CardBody className="p-8 sm:p-10 space-y-6 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-success/10 text-success flex items-center justify-center">
            <Icon path={mdiCheckCircleOutline} className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-theme-text">You're all set!</h1>
            <p className="text-theme-text-secondary">
              Your subscription is now active{planLabel ? ` on the ${planLabel} plan` : ""}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <Chip color="success" variant="flat">Active</Chip>
            {planLabel && <Chip variant="flat">Plan: {planLabel}</Chip>}
            {currentPeriodEnd && (
              <Chip variant="flat">Next billing: {new Date(currentPeriodEnd).toLocaleDateString()}</Chip>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button as={Link} href="/setup" color="primary" className="min-w-[180px]">
              Go to Dashboard
            </Button>
            <Button as={Link} href="/profile/billing" variant="flat" className="min-w-[180px]">
              View Billing
            </Button>
            <Button as={Link} href="/api/billing/portal" variant="bordered" className="min-w-[180px]">
              Manage Subscription
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}


