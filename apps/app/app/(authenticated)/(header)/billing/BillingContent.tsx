"use client";
import { Button, Card, CardBody, Chip, cn } from "@heroui/react";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiCheck, mdiClose } from "@mdi/js";
import { useState } from "react";
import { Plan } from "@repo/types/subscription";

interface Entitlements {
  planId: string;
  active: boolean;
  trialEndsAt: string | null;
  maxDashboards: number;
  maxHAInstances: number;
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

  const [billing, setBilling] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const plans: Plan[] = [
    {
      id: "starter",
      name: "Starter",
      monthly: 5,
      yearly: 50,
      dashboards: 1,
      popular: false,
    },
    {
      id: "mid",
      name: "Mid",
      monthly: 8,
      yearly: 80,
      dashboards: 3,
      popular: true
    },
    {
      id: "pro",
      name: "Pro",
      monthly: 10,
      yearly: 100,
      dashboards: 6,
      popular: false,
    },
  ] as const;

  return (
    <div className="max-w-7xl w-full mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Subscription</h1>
        <p className="text-foreground-500 mt-1">Pick a plan that suits you.</p>
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

        {/* Billing toggle */}
        <div className="mt-6 inline-flex rounded-full bg-content2 p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={cn(
              "px-4 py-1 text-sm rounded-full transition-colors",
              billing === "monthly"
                ? "bg-background shadow text-foreground"
                : "text-foreground-500"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={cn(
              "px-4 py-1 text-sm rounded-full transition-colors",
              billing === "yearly"
                ? "bg-background shadow text-foreground"
                : "text-foreground-500"
            )}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Pricing cards like the reference */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p, idx) => {
          const isActive = entitlements.planId === p.id && entitlements.active;
          const isPopular = p.popular === true;
          const price = billing === "monthly" ? p.monthly : p.yearly;
          return (
            <Card
              key={p.id}
              className={cn(
                "border-default-200",
                isPopular ? "bg-primary/10 border-primary/40" : ""
              )}
            >
              <CardBody className="p-6 space-y-4">
                <div className="space-y-1">
                  <div className="text-sm text-foreground-500 font-medium">
                    {billing === "monthly" ? "Monthly" : "Yearly"}
                  </div>
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                </div>
                <div className="text-4xl font-semibold">£{price}<span className="text-base font-normal text-foreground-500">/{billing === "monthly" ? "mo" : "yr"}</span></div>
                <ul className="text-sm text-foreground-500 space-y-1">
                  <li className="flex items-center gap-2"><Icon path={mdiCheck} className="w-4 h-4 text-success" /> {p.dashboards} dashboards</li>
                  <li className="flex items-center gap-2"><Icon path={mdiCheck} className="w-4 h-4 text-success" /> 1 Home Assistant instance</li>
                  <li className="flex items-center gap-2"><Icon path={mdiClose} className="w-4 h-4 text-foreground-400" /> Multi‑HA</li>
                </ul>
                <form action={`/api/billing/checkout?plan=${p.id}`} method="post">
                  <Button
                    color={isPopular ? "primary" : "default"}
                    type="submit"
                    className="w-full"
                    isDisabled={isActive}
                  >
                    {labelForPlan(p.id)}
                  </Button>
                </form>
              </CardBody>
            </Card>
          );
        })}
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
