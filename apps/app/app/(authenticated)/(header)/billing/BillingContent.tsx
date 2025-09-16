"use client";
import { Button, Card, CardBody, Chip, cn } from "@heroui/react";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiCheck } from "@mdi/js";
import { useState } from "react";
import { Plan } from "@repo/types/subscription";

interface Entitlements {
  planId: string;
  active: boolean;
  trialEndsAt: string | null;
  maxDashboards: number;
  maxHAInstances: number;
  currentPeriodEnd?: string | null;
}

export default function BillingContent({
  entitlements,
}: {
  entitlements: Entitlements;
}) {
  const labelForPlan = (planId: string) => {
    if (entitlements.active) {
      return entitlements.planId === planId ? "Current plan" : "Upgrade";
    }
    return "Subscribe";
  };

  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const plans: Plan[] = [
    {
      id: "starter",
      name: "Starter",
      monthly: 5,
      yearly: 50,
      dashboards: 1,
      ha: 1,
      popular: false,
      features: ["1 dashboard", "1 Home Assistant instance", "Online support"],
    },
    {
      id: "mid",
      name: "Mid",
      monthly: 8,
      yearly: 80,
      dashboards: 3,
      ha: 1,
      popular: true,
      features: ["3 dashboards", "1 Home Assistant instance", "Online support"],
    },
    {
      id: "pro",
      name: "Pro",
      monthly: 10,
      yearly: 100,
      dashboards: 6,
      ha: 2,
      popular: false,
      features: [
        "6 dashboards",
        "2 Home Assistant instances",
        "Online support",
      ],
    },
  ] as const;

  return (
    <div className="max-w-7xl w-full mx-auto py-10 px-4">
      <div className="mb-8 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold">Subscription</h1>
          <p className="text-foreground-500 mt-1">
            Pick a plan that suits you.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Chip
              color={entitlements.active ? "success" : "warning"}
              variant="flat"
            >
              {entitlements.active ? "Active" : "Inactive"}
            </Chip>
            <Chip variant="flat">Plan: {entitlements.planId}</Chip>
            {entitlements.trialEndsAt && (
              <Chip variant="flat">
                Trial ends:{" "}
                {new Date(entitlements.trialEndsAt).toLocaleDateString()}
              </Chip>
            )}
            {!entitlements.active && (
              <Chip color="warning" variant="flat">
                Access limited
              </Chip>
            )}
          </div>
          {entitlements.active && entitlements.currentPeriodEnd && (
            <p className="mt-2 text-sm text-foreground-500">
              Current period ends on{" "}
              {new Date(entitlements.currentPeriodEnd).toLocaleDateString()}. If
              you cancel, access continues until this date.
            </p>
          )}
        </div>
        <Button
          as={Link}
          href="/api/billing/portal"
          variant="bordered"
          color="primary"
          className="min-w-[180px]"
        >
          Manage Subscription
        </Button>
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
          {plans.map((p, idx) => {
            const isActive =
              entitlements.planId === p.id && entitlements.active;
            const isPopular = p.popular === true;
            const price = billing === "monthly" ? p.monthly : p.yearly;
            const monthlyTotal = p.monthly * 12;
            const yearlyPrice = p.yearly;
            const discount = Math.max(0, monthlyTotal - yearlyPrice);
            return (
              <Card
                key={p.id}
                className={cn(
                  "border-default-200",
                  isPopular ? "bg-primary/10 border-primary/40" : ""
                )}
              >
                <CardBody className="p-6 space-y-4 relative">
                  {billing === "yearly" && discount > 0 && (
                    <span className="absolute top-3 right-3 text-xs bg-success text-white px-2 py-0.5 rounded-full shadow-sm">
                      Save £{discount}
                    </span>
                  )}
                  <div className="space-y-1">
                    <div className="text-sm text-foreground-500 font-medium">
                      {billing === "monthly" ? "Monthly" : "Yearly"}
                    </div>
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                  </div>
                  <div className="text-4xl font-semibold">
                    £{price}
                    <span className="text-base font-normal text-foreground-500">
                      /{billing === "monthly" ? "mo" : "yr"}
                    </span>
                  </div>
                  <ul className="text-sm text-foreground-500 space-y-1">
                    {p.features.map((feature, idx) => (
                      <li className="flex items-center gap-2" key={idx}>
                        <Icon
                          path={mdiCheck}
                          className="w-4 h-4 text-success"
                        />{" "}
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <form
                    action={`/api/billing/checkout?plan=${p.id}&interval=${billing}`}
                    method="post"
                  >
                    <Button
                      color="primary"
                      type="submit"
                      className="w-full"
                      isDisabled={isActive}
                    >
                      {labelForPlan(p.id)}
                    </Button>
                    {isActive && (
                      <div className="mt-8 flex items-center justify-center">
                        <form action="/api/billing/cancel" method="post">
                          <Button color="danger" variant="bordered" type="submit">
                            Cancel at period end
                          </Button>
                        </form>
                      </div>
                    )}
                  </form>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Mobile keeps same cards grid above */}

      <div className="mt-10 text-center text-sm text-foreground-500">
        Questions about plans?{" "}
        <Link href="/contact" className="text-primary">
          Contact us
        </Link>
      </div>
    </div>
  );
}
