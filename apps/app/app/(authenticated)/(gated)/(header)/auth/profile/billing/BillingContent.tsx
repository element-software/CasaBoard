"use client";
import { Button, Card, CardBody, Chip, Modal, ModalContent, Spinner, useDisclosure, cn } from "@heroui/react";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiCheck, mdiRocket } from "@mdi/js";
import { useState } from "react";
import { LinkService } from "@repo/lib";
import Stripe from "stripe";
import { useRouter } from "next/navigation";
import { displaySubscriptionPlanName } from "@repo/types/subscription";

interface Entitlements {
  planId: string;
  active: boolean;
  trialEndsAt: string | null;
  maxDashboards: number;
  maxHAInstances: number;
}

export default function BillingContent({
  entitlements,
  currentPeriodEnd,
  cancelAt,
  planLabel,
  stripePlans = [],
  currentPriceId = null,
}: {
  entitlements: Entitlements;
  currentPeriodEnd?: string | null;
  cancelAt?: string | null;
  planLabel?: string | null;
  stripePlans?: Array<Stripe.Price & { product: Stripe.Product }>;
  currentPriceId?: string | null;
}) {
  const router = useRouter();
  const labelForPlan = (priceId: string) => {
    if (entitlements.trialEndsAt) {
      return "Subscribe";
    }
    if (entitlements.active && currentPriceId === priceId) {
      return "Current plan";
    }
    if (entitlements.active && currentPriceId !== priceId) {
      // Find current and target plans in Stripe data
      const currentPlan = stripePlans.find((p) => p.id === currentPriceId);
      const targetPlan = stripePlans.find((p) => p.id === priceId);

      if (currentPlan && targetPlan) {
        const currentAmount = currentPlan.unit_amount || 0;
        const targetAmount = targetPlan.unit_amount || 0;
        return targetAmount > currentAmount ? "Upgrade" : "Downgrade";
      }
      return "Upgrade";
    }
    return "Subscribe";
  };

  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  
  // Loading state for portal buttons
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  // Handle portal button click
  const handlePortalClick = async () => {
    setIsPortalLoading(true);
    setPortalError(null);
    router.push("/api/billing/portal");
  };

  // Filter and group plans by interval
  const monthlyPlans = stripePlans.filter(
    (p) => p.recurring?.interval === "month"
  );
  const yearlyPlans = stripePlans.filter(
    (p) => p.recurring?.interval === "year"
  );

  // Get plans for current billing cycle
  const currentPlans = billing === "monthly" ? monthlyPlans : yearlyPlans;
  const isCurrentPaid = (priceId: string): boolean => {
    return (
      currentPriceId === priceId &&
      entitlements.active &&
      !entitlements.trialEndsAt
    );
  };

  return (
    <div className="max-w-7xl w-full mx-auto py-10 px-4">
      <div className="mb-8 flex flex-row items-center justify-between">
        <div className="flex flex-row items-start w-full">
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold">Subscription</h1>
            <p className="text-foreground-500 mt-1">
              Pick a plan that suits you.
            </p>
          </div>
          <div className="flex grow flex-wrap items-center gap-3 justify-end self-center">
            <Chip
              color={entitlements.active ? "success" : "warning"}
              variant="flat"
            >
              {entitlements.active ? "Active" : "Inactive"}
            </Chip>
            <Chip variant="flat" color="primary">
              Plan:{" "}
              <strong>
                {displaySubscriptionPlanName(planLabel, entitlements.planId)}
              </strong>
            </Chip>
            {entitlements.trialEndsAt && (
              <Chip variant="flat" color="danger">
                Trial ends:{" "}
                <strong>
                  {new Date(entitlements.trialEndsAt).toLocaleDateString()}
                </strong>
              </Chip>
            )}
            {!entitlements.active && (
              <Chip color="warning" variant="flat">
                Access limited
              </Chip>
            )}
            {cancelAt && (
              <Chip color="warning" variant="flat">
                Cancellation is scheduled for{" "}
                {new Date(cancelAt).toLocaleDateString()}.
              </Chip>
            )}
            {currentPeriodEnd && (
              <Chip color="success" variant="flat">
                Current period ends on{" "}
                {new Date(currentPeriodEnd).toLocaleDateString()}.
              </Chip>
            )}
          </div>
        </div>
        {entitlements.active && !entitlements.trialEndsAt && (
          <Button
            onPress={handlePortalClick}
            variant="bordered"
            color="primary"
            className="p-2 px-4 min-w-[230px] ml-4"
            isLoading={isPortalLoading}
            isDisabled={isPortalLoading}
          >
            Manage Subscription in Stripe
          </Button>
        )}
      </div>

      <div className="w-full flex flex-col gap-4 justify-center items-center">
        <div className="mt-6 inline-flex rounded-full bg-content2 p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={cn("px-4 py-1 text-sm rounded-full transition-colors", {
              "bg-primary shadow text-foreground": billing === "monthly",
              "text-foreground-500": billing !== "monthly",
            })}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={cn("px-4 py-1 text-sm rounded-full transition-colors", {
              "bg-primary shadow text-foreground": billing === "yearly",
              "text-foreground-500": billing !== "yearly",
            })}
          >
            Yearly
          </button>
        </div>

        <div className="w-full grid gap-6 md:grid-cols-3">
          {currentPlans.map((plan, idx) => {
            const isPopular = idx === 1; // Make middle plan popular
            const price = (plan.unit_amount || 0) / 100; // Convert from cents
            const interval = plan.recurring?.interval || "month";

            // Calculate yearly discount if applicable
            let discount = 0;
            if (billing === "yearly" && interval === "year") {
              const monthlyEquivalent = monthlyPlans.find(
                (p) => p.product.id === plan.product.id
              );
              if (monthlyEquivalent) {
                const monthlyPrice = (monthlyEquivalent.unit_amount || 0) / 100;
                const yearlyEquivalent = monthlyPrice * 12;
                discount = Math.max(0, yearlyEquivalent - price);
              }
            }

            return (
              <Card
                key={plan.id}
                className={cn("border-default-200", {
                  "bg-primary/10 border-primary/40":
                    isPopular && !isCurrentPaid(plan.id),
                  "bg-green-400/10 border-green-400/40": isCurrentPaid(plan.id),
                })}
              >
                <CardBody className="p-6 space-y-4 relative">
                  {isPopular && !isCurrentPaid(plan.id) && (
                    <Chip
                      color="primary"
                      variant="flat"
                      size="sm"
                      className="absolute top-4 right-4"
                    >
                      POPULAR
                    </Chip>
                  )}
                  {isCurrentPaid(plan.id) && (
                    <Chip
                      color="success"
                      variant="flat"
                      size="sm"
                      className="absolute top-4 right-4"
                    >
                      ACTIVE
                    </Chip>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-foreground-500 font-medium">
                        {billing === "monthly" ? "Monthly" : "Yearly"}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold">
                      {plan.product.name}
                    </h3>
                  </div>
                  <div className="text-4xl font-semibold">
                    £{price.toFixed(0)}
                    <span className="text-base font-normal text-foreground-500">
                      /{interval === "month" ? "mo" : "yr"}
                    </span>
                    {billing === "yearly" && discount > 0 && (
                      <Chip
                        color="success"
                        variant="flat"
                        size="sm"
                        className="ml-2"
                      >
                        Save £{discount.toFixed(0)}
                      </Chip>
                    )}
                  </div>
                  {plan.product.description && (
                    <p className="flex items-center gap-2">
                      <Icon path={mdiCheck} className="w-4 h-4 text-success" />{" "}
                      {plan.product.description}
                    </p>
                  )}
                  <ul className="text-sm text-foreground-500 space-y-1 h-full grow">
                    {plan.product.marketing_features.map((feature) => (
                      <li
                        className="flex items-center gap-2"
                        key={feature.name}
                      >
                        <Icon
                          path={mdiCheck}
                          className="w-4 h-4 text-success"
                        />{" "}
                        {feature.name}
                      </li>
                    ))}
                  </ul>
                    <Button
                      onPress={handlePortalClick}
                      color="primary"
                      type="button"
                      className="w-full py-3 px-4 rounded-sm"
                      isDisabled={isCurrentPaid(plan.id) || isPortalLoading}
                    >
                      {labelForPlan(plan.id)}
                    </Button>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Mobile keeps same cards grid above */}

      <div className="mt-10 text-center text-sm text-foreground-500">
        Questions about plans?{" "}
        <Link
          href={LinkService.crossAppHref("public", "/contact")}
          className="text-primary"
        >
          Contact us
        </Link>
      </div>

      {/* Loading Modal for Portal */}
      <Modal 
        isOpen={isPortalLoading} 
        isDismissable={false}
        hideCloseButton
        className="backdrop-blur-sm"
      >
        <ModalContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <Icon
                path={mdiRocket}
                className="w-12 h-12 text-primary"
              />
              <Spinner 
                size="lg"
                className="absolute -top-4 -right-4" 
                classNames={{
                  wrapper: "w-20 h-20",
                }}
                color="primary"
              />
            </div>
            <div className="text-center mt-4">
              <h3 className="text-lg font-semibold text-foreground">
                Loading Stripe Portal
              </h3>
              <p className="text-sm text-foreground-500 mt-1">
                Please wait while we prepare your billing portal...
              </p>
            </div>
            {portalError && (
              <div className="text-center">
                <p className="text-sm text-danger mb-2">
                  {portalError}
                </p>
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  onPress={() => {
                    setPortalError(null);
                    setIsPortalLoading(false);
                  }}
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
