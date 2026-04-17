"use client";
import { Button, Card, CardBody, Chip, cn } from "@heroui/react";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiCheck } from "@mdi/js";
import { useState } from "react";
import { LinkService } from "@repo/lib";
import Stripe from "stripe";

export default function BillingContent({
  stripePlans = [],
}: {
  stripePlans?: Array<Stripe.Price & { product: Stripe.Product }>;
}) {

  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  

  // Filter and group plans by interval
  const monthlyPlans = stripePlans.filter(
    (p) => p.recurring?.interval === "month"
  );

  // Deduplicate yearly plans by product — prefer the price that has a monthly
  // counterpart (so the discount can be calculated), then take the lowest price.
  const yearlyPlans = stripePlans
    .filter((p) => p.recurring?.interval === "year")
    .reduce<Array<Stripe.Price & { product: Stripe.Product }>>((acc, plan) => {
      const existing = acc.find((p) => p.product.id === plan.product.id);
      if (!existing) return [...acc, plan];
      const existingHasMonthly = monthlyPlans.some((m) => m.product.id === existing.product.id);
      const newHasMonthly = monthlyPlans.some((m) => m.product.id === plan.product.id);
      if (!existingHasMonthly && newHasMonthly) return [...acc.filter((p) => p.product.id !== plan.product.id), plan];
      if ((plan.unit_amount || 0) < (existing.unit_amount || 0)) return [...acc.filter((p) => p.product.id !== plan.product.id), plan];
      return acc;
    }, []);

  // Get plans for current billing cycle
  const currentPlans = billing === "monthly" ? monthlyPlans : yearlyPlans;


  return (
    <div className="max-w-7xl w-full mx-auto py-10 px-4 pt-40">
      <div className="mb-8 flex flex-row items-center justify-between">
        <div className="flex flex-row items-start w-full">
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold">Pricing</h1>
            <p className="text-foreground-500 mt-1">
              Pick a plan that suits you.
            </p>
          </div>
        </div>
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
                    isPopular,
                })}
              >
                <CardBody className="p-6 space-y-4 relative">
                  {isPopular && (
                    <Chip
                      color="primary"
                      variant="flat"
                      size="sm"
                      className="absolute top-4 right-4"
                    >
                      POPULAR
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
                    <li className="flex items-start gap-2 pt-1">
                      <Icon path={mdiCheck} className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span>Optional cloud sync <span className="text-foreground-400">(off by default)</span></span>
                    </li>
                  </ul>
                    <Button
                      as={Link}
                      href={LinkService.crossAppHref("app", "/auth/login")}
                      color="primary"
                      type="button"
                      className="w-full py-3 px-4 rounded-sm"
                    >
                      Subscribe
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
    </div>
  );
}
