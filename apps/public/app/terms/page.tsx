import type { Metadata } from "next";
import Icon from "@mdi/react";
import Link from "next/link";
import {
  mdiFileDocumentOutline,
  mdiCheckCircle,
  mdiEmail,
  mdiShieldCheck,
  mdiLightbulbOnOutline,
} from "@mdi/js";
import { metadataForRoute } from "../lib/og/content";

export const metadata: Metadata = metadataForRoute("terms");

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="font-mono text-xs text-violet-400 tracking-widest select-none">{n}</span>
      <div className="h-px flex-1 bg-slate-100" />
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

export default function TermsPage() {
  return (
    <>
      {/* ── Full-width hero ── */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-violet-700 via-violet-800 to-indigo-900" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 25% 65%, rgba(167,139,250,0.3) 0%, transparent 55%), radial-gradient(ellipse at 75% 20%, rgba(99,102,241,0.35) 0%, transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-20 text-center">
          <p className="text-violet-300 text-xs font-semibold uppercase tracking-widest mb-5">
            Legal
          </p>
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <Icon path={mdiFileDocumentOutline} className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Terms
          </h1>
          <p className="text-violet-200/80 text-lg max-w-2xl mx-auto mb-10">
            CasaBoard is free, open-source software you run yourself. There&apos;s no CasaBoard
            service to sign up for, so most of the usual SaaS terms simply don&apos;t apply.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: mdiCheckCircle, label: "Free forever" },
              { icon: mdiShieldCheck, label: "No account required" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm text-white font-medium"
              >
                <Icon path={badge.icon} className="w-4 h-4 text-violet-300" />
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* 01 · What CasaBoard is */}
        <section>
          <SectionLabel n="01" label="What CasaBoard is" />
          <div className="border-l-4 border-slate-200 pl-6 space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              CasaBoard is open-source software distributed for you to run on your own
              infrastructure (via Docker), alongside your own Home Assistant instance. We — the
              maintainers — do not operate a hosted version of CasaBoard, do not create accounts
              for you, and have no access to any installation you run.
            </p>
          </div>
        </section>

        {/* 02 · No warranty */}
        <section>
          <SectionLabel n="02" label="No warranty" />
          <div className="border-l-4 border-slate-200 pl-6 space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              CasaBoard is provided &quot;as is&quot;, without warranty of any kind, express or
              implied. You are responsible for how you deploy it, what it connects to, and any
              data it stores on your own infrastructure. See the license in the source repository
              for the full legal text.
            </p>
          </div>
        </section>

        {/* 03 · Your data */}
        <section>
          <SectionLabel n="03" label="Your data" />
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Dashboard layouts, sidebars, themes, and your Home Assistant connection details are
            stored as local files on the machine you run CasaBoard on. Nothing is transmitted to
            the maintainers or any third party by the software itself.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            For a full explanation of what&apos;s stored and where, see our{" "}
            <Link href="/security" className="text-violet-600 hover:underline">Security page</Link> and{" "}
            <Link href="/privacy" className="text-violet-600 hover:underline">Privacy Policy</Link>.
          </p>
        </section>

        {/* 04 · Feedback & feature requests */}
        <section>
          <SectionLabel n="04" label="Feedback & feature requests" />
          <div className="flex gap-4 p-5 bg-violet-50/80 border border-violet-100 rounded-2xl">
            <Icon path={mdiLightbulbOnOutline} className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
            <div className="space-y-3">
              <p className="text-sm text-slate-700 leading-relaxed">
                CasaBoard is shaped by the people who use it. We welcome ideas, bug reports, and
                pull requests through the project&apos;s GitHub repository.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors"
                >
                  Share feedback or a feature idea
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-slate-50 border border-slate-100 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
              <Icon path={mdiEmail} className="w-5 h-5 text-violet-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Questions about these terms?</h2>
              <p className="text-slate-500 text-sm mb-5">
                If anything here is unclear, get in touch or open an issue on GitHub.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors"
              >
                Contact form
              </Link>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-6 pt-5 border-t border-slate-200">
            Last reviewed July 2026.
          </p>
        </section>

      </div>
    </>
  );
}
