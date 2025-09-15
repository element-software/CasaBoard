"use client";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import Link from "next/link";

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
  const tiers = [
    {
      id: "starter",
      name: "Starter",
      price: "£5/mo",
      features: ["1 dashboard"],
    },
    { id: "mid", name: "Mid", price: "£8/mo", features: ["3 dashboards"] },
    { id: "pro", name: "Pro", price: "£10/mo", features: ["6 dashboards"] },
    {
      id: "super_25",
      name: "Super 25",
      price: "£25/mo",
      features: ["3 HA", "10 dashboards"],
    },
    {
      id: "super_40",
      name: "Super 40",
      price: "£40/mo",
      features: ["5 HA", "20 dashboards"],
    },
    {
      id: "super_60",
      name: "Super 60",
      price: "£60/mo",
      features: ["10 HA", "50 dashboards"],
    },
  ];

  return (
    <div className="max-w-7xl w-full mx-auto py-10 px-4">
      <div className="flex flex-col gap-4 md:flex-row items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Billing</h1>
        <div className="flex items-center gap-3">
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
        </div>
      </div>
      {!entitlements.active && (
        <p className="mb-6 text-warning">
          Your trial has ended or is inactive. Pick a plan below to continue.
        </p>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.id}>
            <CardBody className="space-y-3">
              <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-medium">{tier.name}</h2>
                <span className="text-lg">{tier.price}</span>
              </div>
              <ul className="text-sm text-foreground-500">
                {tier.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <form
                action={`/api/billing/checkout?plan=${tier.id}`}
                method="post"
              >
                <Button color="primary" type="submit" className="w-full">
                  Subscribe
                </Button>
              </form>
              {/* <Button as={Link} href="/api/billing/portal" variant="flat" className="w-full">
                Manage subscription
              </Button> */}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
