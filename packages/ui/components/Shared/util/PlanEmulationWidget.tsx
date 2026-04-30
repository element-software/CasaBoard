"use client";
import { useState, useTransition } from "react";
import { EmulatedTier } from "@repo/lib/utils/planEmulation";

type Tier = EmulatedTier | "off";

const TIERS: { id: Tier; label: string; color: string }[] = [
  { id: "off", label: "Off", color: "bg-gray-600 text-white" },
  { id: "free", label: "Free", color: "bg-slate-500 text-white" },
  { id: "starter", label: "Starter", color: "bg-blue-600 text-white" },
  { id: "mid", label: "Mid", color: "bg-violet-600 text-white" },
  { id: "pro", label: "Pro", color: "bg-orange-500 text-white" },
  { id: "lapsed", label: "Lapsed", color: "bg-red-600 text-white" },
];

interface PlanEmulationWidgetProps {
  currentTier: string;
  onSetTier: (tier: Tier) => Promise<void>;
}

export default function PlanEmulationWidget({
  currentTier,
  onSetTier,
}: PlanEmulationWidgetProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [optimistic, setOptimistic] = useState<Tier>(
    (currentTier as Tier) || "off"
  );
  const [isPending, startTransition] = useTransition();

  const handleSelect = (tier: Tier) => {
    setOptimistic(tier);
    startTransition(async () => {
      await onSetTier(tier);
      // Full reload so server components (entitlements, templates) re-render
      window.location.reload();
    });
  };

  const activeTier = TIERS.find((t) => t.id === optimistic) ?? TIERS[0];

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-2 select-none"
      style={{ fontFamily: "monospace" }}
    >
      {!collapsed && (
        <div className="flex flex-col gap-1.5 bg-black/90 border border-white/10 rounded-xl p-3 shadow-2xl backdrop-blur-sm">
          <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1 px-1">
            Plan Emulation
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TIERS.map((tier) => (
              <button
                key={tier.id}
                onClick={() => handleSelect(tier.id)}
                disabled={isPending}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                  optimistic === tier.id
                    ? `${tier.color} ring-2 ring-white/40 scale-105`
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                } disabled:opacity-50`}
              >
                {tier.label}
              </button>
            ))}
          </div>
          {optimistic !== "off" && (
            <div className="text-[10px] text-white/30 px-1 mt-0.5">
              Emulating:{" "}
              <span className="text-white/60">{activeTier.label}</span>
              {isPending && " …"}
            </div>
          )}
        </div>
      )}

      {/* Toggle pill */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className={`text-[10px] px-3 py-1.5 rounded-full font-medium shadow-lg transition-all ${
          optimistic !== "off"
            ? `${activeTier.color} ring-1 ring-white/20`
            : "bg-black/70 text-white/50 border border-white/10"
        }`}
      >
        {optimistic !== "off" ? `⚙ ${activeTier.label}` : "⚙ Emulation"}
      </button>
    </div>
  );
}
