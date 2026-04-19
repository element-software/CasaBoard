import type { Metadata } from "next";
import Icon from "@mdi/react";
import Link from "next/link";
import {
  mdiFileDocumentOutline,
  mdiAlertCircleOutline,
  mdiCheckCircle,
  mdiEmail,
  mdiClockOutline,
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
            Terms of Service
          </h1>
          <p className="text-violet-200/80 text-lg max-w-2xl mx-auto mb-10">
            CasaBoard is currently in active development. These terms explain what that means
            for your data, your access, and what happens when we go live.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: mdiClockOutline, label: "Beta period" },
              { icon: mdiCheckCircle, label: "30-day notice" },
              { icon: mdiShieldCheck, label: "Clear terms" },
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

        {/* Beta notice */}
        <div className="flex gap-4 p-5 bg-amber-50 border border-amber-200 rounded-2xl">
          <Icon path={mdiAlertCircleOutline} className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 text-sm mb-1">CasaBoard is in active development — not yet suitable for production use</p>
            <p className="text-sm text-amber-800 leading-relaxed">
              Dashboard data may be deleted without notice if significant changes are required. Do not
              rely on CasaBoard for anything critical until we announce the first production release.
              We will notify all signed-up users when that happens.
            </p>
          </div>
        </div>

        {/* 01 · Plans & pricing */}
        <section>
          <SectionLabel n="01" label="Plans & pricing" />
          <div className="border-l-4 border-slate-200 pl-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">Free tier</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                CasaBoard offers a free tier that remains available for as long as the service is run and
                maintained. The free plan includes a limited feature set — see the{" "}
                <Link href="/pricing" className="text-violet-600 hover:underline">pricing page</Link>{" "}
                for what&apos;s included.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">Paid plans</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Paid plans are available for users who need additional pages, features, or support.
                Subscriptions are billed through Stripe. During development, all billing is in test mode
                — no payments are taken. You will not be charged until we announce the first production
                release and you actively subscribe.
              </p>
            </div>
          </div>
        </section>

        {/* 02 · During development */}
        <section>
          <SectionLabel n="02" label="During development" />
          <div className="border-l-4 border-slate-200 pl-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">Not for production use</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                CasaBoard is not yet suitable for production use. Dashboard data — including page layouts
                and connected instance metadata — may be deleted without notice if a significant change
                such as a major database migration is required. Bear this in mind and do not use
                CasaBoard for anything critical during this period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">Data stability</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                You cannot hold us responsible for any data loss, damage, or inconvenience during the
                development phase. Once we have released the first production version, you can have
                confidence that the service is stable and suitable for everyday use.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">Email communications</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                By signing up, you agree to be contacted by email about service updates and
                notifications — including the first production release announcement. You can opt out of
                non-essential emails at any time by emailing{" "}
                <a href="mailto:support@casaboard.dev" className="text-violet-600 hover:underline">
                  support@casaboard.dev
                </a>.
              </p>
            </div>
          </div>
        </section>

        {/* 03 · Data & Home Assistant */}
        <section>
          <SectionLabel n="03" label="Your data & Home Assistant" />
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            By using CasaBoard, you allow us to store certain data on your behalf — specifically,
            your dashboard layouts, account information, and optionally your Home Assistant instance
            metadata if you enable cloud sync on a paid plan.
          </p>
          <div className="p-5 bg-white border border-slate-100 rounded-2xl mb-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              You agree to hold us harmless from any data loss, breach, inconsistency, or damage
              relating to your stored data, including Home Assistant instance data. We will not be
              held responsible for any loss during the development period or beyond.
            </p>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            For a full explanation of what we store versus what stays in your browser, see our{" "}
            <Link href="/security" className="text-violet-600 hover:underline">Security page</Link> and{" "}
            <Link href="/privacy" className="text-violet-600 hover:underline">Privacy Policy</Link>.
          </p>
        </section>

        {/* 04 · First production release */}
        <section>
          <SectionLabel n="04" label="First production release" />
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="p-5 bg-white border border-slate-100 rounded-2xl">
              <p className="font-semibold text-slate-900 text-sm mb-2">What changes at launch</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                When we release the first production version, CasaBoard will be considered stable and
                suitable for everyday production use. All signed-up users will be notified by email.
                The free tier continues post-launch. Paid features will require an active subscription.
              </p>
            </div>
            <div className="p-5 bg-white border border-slate-100 rounded-2xl">
              <p className="font-semibold text-slate-900 text-sm mb-2">Subscribing after launch</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Active users will be given <strong>30 days</strong> from the launch announcement to
                subscribe if they use paid features. If no subscription is taken within that window,
                paid-tier data will be deleted. You can cancel a subscription at any time.
              </p>
            </div>
          </div>
          <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl">
            <p className="text-sm text-violet-800">
              We will do our best to carry data over from development to production, but cannot
              guarantee continuity across major migrations. We will communicate clearly before any
              such event.
            </p>
          </div>
        </section>

        {/* 05 · Changes */}
        <section>
          <SectionLabel n="05" label="Changes to these terms" />
          <p className="text-slate-600 text-sm leading-relaxed">
            We reserve the right to update these terms at any time. Changes will be posted on this
            page. For significant changes, we will notify you by email where possible. Continued use
            of CasaBoard after any changes constitutes acceptance of the revised terms.
          </p>
        </section>

        {/* 06 · Feedback & feature requests */}
        <section>
          <SectionLabel n="06" label="Feedback & feature requests" />
          <div className="flex gap-4 p-5 bg-violet-50/80 border border-violet-100 rounded-2xl">
            <Icon path={mdiLightbulbOnOutline} className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
            <div className="space-y-3">
              <p className="text-sm text-slate-700 leading-relaxed">
                CasaBoard is shaped by people who use it. We welcome your ideas — whether that&apos;s a
                rough sketch for a new feature, a pain point in your workflow, or something that
                doesn&apos;t feel quite right yet. Honest feedback helps us prioritize what to build
                next and how to improve the product for everyone.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                There&apos;s no obligation; sending feedback doesn&apos;t create a contract or promise
                that a specific change will ship. We read what you send and use it to guide our roadmap.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors"
                >
                  Share feedback or a feature idea
                </Link>
                <a
                  href="mailto:support@casaboard.dev?subject=CasaBoard%20feedback"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-violet-200 text-slate-700 text-sm font-semibold rounded-xl hover:border-violet-300 hover:bg-white transition-all"
                >
                  <Icon path={mdiEmail} className="w-4 h-4 text-violet-600" />
                  Email us
                </a>
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
                If anything here is unclear or you&apos;d like more information, get in touch.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:support@casaboard.dev"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors"
                >
                  <Icon path={mdiEmail} className="w-4 h-4" />
                  support@casaboard.dev
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:border-violet-200 hover:bg-violet-50 transition-all"
                >
                  Contact form
                </Link>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-6 pt-5 border-t border-slate-200">
            Last reviewed April 2026. These terms are updated as the service evolves.
          </p>
        </section>

      </div>
    </>
  );
}
