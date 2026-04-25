"use client";
import { Button, cn } from "@heroui/react";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiCheck, mdiArrowRight, mdiInfinity } from "@mdi/js";
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
    <div className="max-w-7xl w-full mx-auto px-4 py-16 pb-24">
      <div className="w-full flex flex-col gap-8 justify-center items-center">

        {/* ── Free plan ── */}
        <div className="w-full bg-white border border-slate-100 shadow-sm rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
            {/* Left: heading + price */}
            <div className="sm:w-48 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-3">
                <Icon path={mdiInfinity} className="w-3.5 h-3.5" />
                Free forever
              </span>
              <h3 className="text-2xl font-bold text-slate-900">£0</h3>
              <p className="text-sm text-slate-400 mt-0.5">No credit card required</p>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px self-stretch bg-slate-100" />

            {/* Middle: features */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {[
                "1 dashboard page",
                "1 Home Assistant instance",
                "Full drag-and-drop editor",
                "Live entity data via WebSocket",
                "All built-in components",
                "Local-first — tokens stay in your browser",
                "No cloud sync (optional on paid plans)",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                  <Icon path={mdiCheck} className="w-4 h-4 text-emerald-500 shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            {/* Right: CTA */}
            <div className="sm:w-40 shrink-0">
              <Button
                as={Link}
                href={LinkService.crossAppHref("app", "/auth/login")}
                className="w-full font-semibold bg-slate-900 text-white hover:bg-slate-700"
              >
                Get started free
                <Icon path={mdiArrowRight} className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 h-px bg-slate-100" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest shrink-0">Or upgrade for more</p>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* Billing toggle */}
        <div className="inline-flex rounded-full bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={cn("px-5 py-1.5 text-sm rounded-full font-medium transition-all", {
              "bg-white shadow text-slate-900": billing === "monthly",
              "text-slate-500 hover:text-slate-700": billing !== "monthly",
            })}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={cn("px-5 py-1.5 text-sm rounded-full font-medium transition-all", {
              "bg-white shadow text-slate-900": billing === "yearly",
              "text-slate-500 hover:text-slate-700": billing !== "yearly",
            })}
          >
            Yearly
          </button>
        </div>

        <div className="w-full grid gap-6 md:grid-cols-3">
          {currentPlans.map((plan, idx) => {
            const isPopular = idx === 1;
            const price = (plan.unit_amount || 0) / 100;
            const interval = plan.recurring?.interval || "month";

            let discount = 0;
            if (billing === "yearly" && interval === "year") {
              const monthlyEquivalent = monthlyPlans.find((p) => p.product.id === plan.product.id);
              if (monthlyEquivalent) {
                const monthlyPrice = (monthlyEquivalent.unit_amount || 0) / 100;
                discount = Math.max(0, monthlyPrice * 12 - price);
              }
            }

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-2xl p-6 flex flex-col gap-4 border transition-all",
                  isPopular
                    ? "bg-violet-600 border-violet-600 shadow-xl shadow-violet-200"
                    : "bg-white border-slate-100 shadow-sm hover:shadow-md"
                )}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white text-violet-700 text-xs font-bold rounded-full shadow">
                    MOST POPULAR
                  </span>
                )}

                <div>
                  <p className={cn("text-xs font-semibold uppercase tracking-widest mb-1", isPopular ? "text-violet-200" : "text-slate-400")}>
                    {billing === "monthly" ? "Monthly" : "Yearly"}
                  </p>
                  <h3 className={cn("text-xl font-bold", isPopular ? "text-white" : "text-slate-900")}>
                    {plan.product.name}
                  </h3>
                </div>

                <div className="flex items-end gap-1">
                  <span className={cn("text-4xl font-bold", isPopular ? "text-white" : "text-slate-900")}>
                    £{price.toFixed(0)}
                  </span>
                  <span className={cn("text-sm mb-1", isPopular ? "text-violet-200" : "text-slate-400")}>
                    /{interval === "month" ? "mo" : "yr"}
                  </span>
                  {billing === "yearly" && discount > 0 && (
                    <span className="ml-2 mb-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Save £{discount.toFixed(0)}
                    </span>
                  )}
                </div>

                {plan.product.description && (
                  <p className={cn("text-sm flex items-center gap-2", isPopular ? "text-violet-100" : "text-slate-500")}>
                    <Icon path={mdiCheck} className={cn("w-4 h-4 shrink-0", isPopular ? "text-violet-200" : "text-green-500")} />
                    {plan.product.description}
                  </p>
                )}

                <ul className="space-y-2 flex-1">
                  {plan.product.marketing_features.map((feature) => (
                    <li key={feature.name} className={cn("flex items-center gap-2 text-sm", isPopular ? "text-violet-100" : "text-slate-600")}>
                      <Icon path={mdiCheck} className={cn("w-4 h-4 shrink-0", isPopular ? "text-violet-200" : "text-green-500")} />
                      {feature.name}
                    </li>
                  ))}
                  <li className={cn("flex items-start gap-2 text-sm pt-1", isPopular ? "text-violet-100" : "text-slate-600")}>
                    <Icon path={mdiCheck} className={cn("w-4 h-4 shrink-0 mt-0.5", isPopular ? "text-violet-200" : "text-green-500")} />
                    <span>Optional cloud sync <span className={isPopular ? "text-violet-300" : "text-slate-400"}>(off by default)</span></span>
                  </li>
                </ul>

                <Button
                  as={Link}
                  href={LinkService.crossAppHref("app", "/auth/login")}
                  type="button"
                  className={cn(
                    "w-full font-semibold",
                    isPopular
                      ? "bg-white text-violet-700 hover:bg-violet-50"
                      : "bg-violet-600 text-white hover:bg-violet-700"
                  )}
                >
                  Subscribe
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-slate-400">
        Questions about plans?{" "}
        <Link href={LinkService.crossAppHref("public", "/contact")} className="text-violet-600 hover:underline">
          Contact us
        </Link>
      </div>
    </div>
  );
}
