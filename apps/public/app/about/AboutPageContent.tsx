"use client";

import { Button, Link } from "@heroui/react";
import Icon from "@mdi/react";
import {
  mdiHomeAssistant,
  mdiGrid,
  mdiCheckCircle,
  mdiLightbulb,
} from "@mdi/js";

export default function AboutPageContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Quick start steps */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">How to use CasaBoard</h2>
        <p className="text-slate-500">Follow these steps to set up your smart home dashboard.</p>
      </div>

      {/* Quick Start card */}
      <div className="mb-8 bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center gap-3">
          <Icon path={mdiLightbulb} className="w-5 h-5 text-violet-600" />
          <h2 className="text-base font-semibold text-slate-900">Quick Start Guide</h2>
        </div>
        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Login with Google", "Connect Home Assistant", "Create Your First Page", "Add Components"].map(
              (label, idx) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-sm font-medium text-slate-900">{label}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        {[
          { icon: mdiGrid, label: "Drag‑and‑drop editor", color: "text-violet-600", bg: "bg-violet-50" },
          { icon: mdiHomeAssistant, label: "Live HA data", color: "text-cyan-600", bg: "bg-cyan-50" },
          { icon: mdiCheckCircle, label: "Privacy‑first local HA", color: "text-green-600", bg: "bg-green-50" },
        ].map((f) => (
          <div key={f.label} className="flex items-center gap-3 p-4 bg-white border border-slate-100 shadow-sm rounded-xl">
            <div className={`w-9 h-9 ${f.bg} rounded-lg flex items-center justify-center shrink-0`}>
              <Icon path={f.icon} className={`w-5 h-5 ${f.color}`} />
            </div>
            <span className="text-sm font-medium text-slate-800">{f.label}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 text-center">
        <p className="text-slate-600 mb-4">Looking for the full guide?</p>
        <Button as={Link} href="/docs" color="primary">
          Open documentation
        </Button>
      </div>
    </div>
  );
}
