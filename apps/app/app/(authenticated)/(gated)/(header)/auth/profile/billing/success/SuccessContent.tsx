"use client";
import { Card, CardBody, Button, Chip, Divider } from "@heroui/react";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiCheckCircleOutline, mdiArrowRight } from "@mdi/js";
import { SubscriptionSummary, Entitlements } from "@repo/types/subscription";

export default function SuccessContent({
  planLabel,
  currentPeriodEnd,
  cancelAt,
  isUpgrade = false,
  subscription,
  entitlements,
}: {
  planLabel: string | null;
  currentPeriodEnd: string | null;
  cancelAt?: string | null;
  isUpgrade?: boolean;
  subscription?: SubscriptionSummary;
  entitlements?: Entitlements;
}) {
  // Debug logging
  console.log('SuccessContent props:', {
    planLabel,
    currentPeriodEnd,
    cancelAt,
    isUpgrade,
    subscription,
    entitlements
  });

  return (
    <div className="min-h-screen">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-success/20 text-success flex items-center justify-center mb-8 shadow-lg">
          <Icon path={mdiCheckCircleOutline} className="w-12 h-12" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          {isUpgrade ? "Trial Upgraded!" : "Thank You!"}
        </h1>

        <p className="text-xl text-foreground-600 mb-8 max-w-2xl mx-auto">
          {isUpgrade
            ? `Your trial has been successfully upgraded to ${planLabel || "a paid subscription"}. You now have full access to all features.`
            : `Your subscription is now active${planLabel ? ` on the ${planLabel} plan` : ""}. Welcome to the full experience!`}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            as={Link}
            href="/setup"
            color="primary"
            size="lg"
            className="min-w-[200px] h-12 text-lg font-semibold"
            endContent={<Icon path={mdiArrowRight} className="w-5 h-5" />}
          >
            Go to Dashboard
          </Button>
          <Button
            as={Link}
            href="/auth/profile/billing"
            variant="bordered"
            size="lg"
            className="min-w-[200px] h-12 text-lg"
          >
            View Billing
          </Button>
        </div>
      </div>

      {/* Subscription Details Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Card className="bg-background/80 backdrop-blur border border-divider shadow-xl">
          <CardBody className="p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
              Subscription Details
            </h2>

            <div className="grid grid-cols-1 gap-6 ">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5">
                  <span className="text-foreground-600 font-medium">
                    Status
                  </span>
                  <Chip
                    color={entitlements?.active ? "success" : "warning"}
                    variant="flat"
                    size="lg"
                  >
                    {entitlements?.active ? "Active" : "Inactive"}
                  </Chip>
                </div>

                {planLabel && (
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/5">
                    <span className="text-foreground-600 font-medium">
                      Plan
                    </span>
                    <Chip variant="flat" color="primary" size="lg">
                      {planLabel}
                    </Chip>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {currentPeriodEnd && (
                  <div className="flex items-center justify-between p-4 rounded-lg bg-success/5">
                    <span className="text-foreground-600 font-medium">
                      Next Billing
                    </span>
                    <span className="text-foreground font-medium">
                      {new Date(currentPeriodEnd).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {entitlements?.trialEndsAt && (
                  <div className="flex items-center justify-between p-4 rounded-lg bg-warning/5">
                    <span className="text-foreground-600 font-medium">
                      Trial Ends
                    </span>
                    <span className="text-foreground font-medium">
                      {new Date(entitlements.trialEndsAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Status Information */}
            {(cancelAt || subscription?.hasPaymentMethod === false) && (
              <>
                <Divider className="my-6" />
                <div className="space-y-3">
                  {cancelAt && (
                    <div className="flex items-center justify-between p-4 rounded-lg bg-warning/5 border border-warning/20">
                      <span className="text-foreground-600 font-medium">
                        Cancellation Scheduled
                      </span>
                      <span className="text-foreground font-medium">
                        {new Date(cancelAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {subscription?.hasPaymentMethod === false && (
                    <div className="flex items-center justify-between p-4 rounded-lg bg-warning/5 border border-warning/20">
                      <span className="text-foreground-600 font-medium">
                        Payment Method
                      </span>
                      <Chip variant="flat" color="warning" size="sm">
                        No payment method
                      </Chip>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
