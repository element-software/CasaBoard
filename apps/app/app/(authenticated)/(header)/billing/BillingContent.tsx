"use client";
import { Button, Card, CardBody, Chip, cn } from "@heroui/react";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiCheck, mdiClose, mdiStar } from "@mdi/js";

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
  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "£5/mo",
      dashboards: 1,
      ha: 1,
      multiHa: false,
      priority: false,
      popular: false,
    },
    {
      id: "mid",
      name: "Mid",
      price: "£8/mo",
      dashboards: 3,
      ha: 1,
      multiHa: false,
      priority: false,
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "£10/mo",
      dashboards: 6,
      ha: 1,
      multiHa: false,
      priority: true,
      popular: true,
    },
  ];

  const features: {
    label: string;
    get: (p: (typeof plans)[number]) => string | boolean;
  }[] = [
    { label: "Dashboards", get: (p) => `${p.dashboards}` },
    { label: "HA instances", get: (p) => `${p.ha}` },
    { label: "Multi‑HA", get: (p) => p.multiHa },
    { label: "Priority support", get: (p) => p.priority },
  ];

  return (
    <div className="max-w-7xl w-full mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Billing</h1>
        <p className="text-foreground-500 mt-1">
          Choose the plan that fits your needs.
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
      </div>

      {/* Desktop comparison table */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-[860px] rounded-lg border border-default-200">
          {/* Headers */}
          <div className="grid grid-cols-4">
            <div className="p-6 border-b border-default-200"></div>
            {plans.map((p) => (
              <div
                key={p.id}
                className={cn("p-6 border-b border-l border-default-200", {
                  relative: p.popular,
                })}
              >
                {p.popular && (
                  <span className="absolute top-2 right-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full flex items-center gap-1 w-fit self-center mb-2">
                    <Icon path={mdiStar} className="w-3 h-3" /> Popular
                  </span>
                )}
                <div className="text-center space-y-1">
                  <div className="text-sm text-foreground-500 font-medium">
                    {p.name}
                  </div>
                  <div className="text-2xl font-semibold">{p.price}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Feature rows */}
          {features.map((f, idx) => (
            <div
              key={f.label}
              className={`grid grid-cols-4 ${idx % 2 === 0 ? "bg-content2/30" : "bg-transparent"}`}
            >
              <div className="p-4 text-sm font-medium text-foreground-600 border-t border-default-200">
                {f.label}
              </div>
              {plans.map((p) => {
                const value = f.get(p);
                const isBool = typeof value === "boolean";
                return (
                  <div
                    key={p.id + f.label}
                    className="p-4 text-center border-t border-l border-default-200"
                  >
                    {isBool ? (
                      (value as boolean) ? (
                        <Icon
                          path={mdiCheck}
                          className="w-5 h-5 text-success mx-auto"
                        />
                      ) : (
                        <Icon
                          path={mdiClose}
                          className="w-5 h-5 text-foreground-400 mx-auto"
                        />
                      )
                    ) : (
                      <span className="text-sm">{value as string}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* CTA row */}
          <div className="grid grid-cols-4">
            <div className="p-4 border-t border-default-200"></div>
            {plans.map((p) => (
              <div
                key={p.id}
                className="p-4 border-t border-l border-default-200"
              >
                <form
                  action={`/api/billing/checkout?plan=${p.id}`}
                  method="post"
                >
                  <Button
                    color="primary"
                    type="submit"
                    className="w-full"
                    isDisabled={entitlements.planId === p.id && entitlements.active}
                  >
                    {entitlements.active
                      ? entitlements.planId === p.id
                        ? "Current plan"
                        : "Upgrade"
                      : "Subscribe"}
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-6 md:hidden sm:grid-cols-2">
        {plans.map((p) => (
          <Card key={p.id} className="border border-default-200">
            <CardBody className="space-y-3 p-6">
              <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-semibold">{p.name}</h2>
                <span className="text-lg text-foreground-600">{p.price}</span>
              </div>
              <ul className="space-y-1 text-sm text-foreground-500">
                <li>Dashboards: {p.dashboards}</li>
                <li>HA instances: {p.ha}</li>
                <li>Multi‑HA: {p.multiHa ? "Yes" : "No"}</li>
                <li>Priority support: {p.priority ? "Yes" : "No"}</li>
              </ul>
              <form action={`/api/billing/checkout?plan=${p.id}`} method="post">
                <Button
                  color="primary"
                  type="submit"
                  className="w-full"
                  isDisabled={entitlements.planId === p.id && entitlements.active}
                >
                  {entitlements.active
                    ? entitlements.planId === p.id
                      ? "Current plan"
                      : "Upgrade"
                    : "Subscribe"}
                </Button>
              </form>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="mt-10 text-center text-sm text-foreground-500">
        Questions about plans?{" "}
        <Link href="/contact" className="text-primary">
          Contact us
        </Link>
      </div>
    </div>
  );
}
