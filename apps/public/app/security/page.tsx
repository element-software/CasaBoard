import Icon from "@mdi/react";
import Link from "next/link";
import {
  mdiShieldCheck,
  mdiLock,
  mdiDatabase,
  mdiEyeOff,
  mdiDatabaseLock,
  mdiAccountKey,
  mdiCheckCircle,
  mdiCloseCircle,
  mdiEmail,
  mdiServer,
  mdiCloudOffOutline,
  mdiArrowRight,
  mdiWifiOff,
  mdiLanConnect,
} from "@mdi/js";

// ── Reusable primitives ──────────────────────────────────────────────────────

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="font-mono text-xs text-violet-400 tracking-widest select-none">{n}</span>
      <div className="h-px flex-1 bg-slate-100" />
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-slate-50 last:border-0">
      <span className="font-mono text-xs text-slate-400 w-44 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-slate-700">{value}</span>
    </div>
  );
}

function CheckItem({ children, color = "emerald" }: { children: React.ReactNode; color?: "emerald" | "red" | "slate" }) {
  const icon = color === "red" ? mdiCloseCircle : mdiCheckCircle;
  const iconColor = color === "emerald" ? "text-emerald-500" : color === "red" ? "text-red-400" : "text-slate-400";
  return (
    <li className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
      <Icon path={icon} className={`w-4 h-4 ${iconColor} shrink-0 mt-0.5`} />
      {children}
    </li>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SecurityPage() {
  return (
    <>
      {/* ── Full-width hero ── */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-violet-700 via-violet-800 to-indigo-900" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 15% 60%, rgba(167,139,250,0.35) 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, rgba(99,102,241,0.40) 0%, transparent 55%)",
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
            Security & Privacy
          </p>
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <Icon path={mdiShieldCheck} className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Privacy-first by design
          </h1>
          <p className="text-violet-200/80 text-lg max-w-2xl mx-auto mb-10">
            Your Home Assistant tokens stay encrypted in your browser. We never see your
            credentials — by architecture, not just policy.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: mdiLock, label: "AES-GCM 256-bit" },
              { icon: mdiShieldCheck, label: "Local-first" },
              { icon: mdiEyeOff, label: "Zero server tokens" },
              { icon: mdiDatabase, label: "Supabase RLS" },
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

      {/* ── Page content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* ── 01 · Core guarantee ── */}
        <section>
          <SectionLabel n="01" label="Core guarantee" />
          <div className="border-l-4 border-violet-600 pl-6 mb-10">
            <p className="text-2xl font-bold text-slate-900 leading-snug mb-2">
              Your Home Assistant tokens never leave your browser.
            </p>
            <p className="text-slate-500">
              This isn&apos;t a policy promise — it&apos;s the way the system is built. CasaBoard servers have
              no route to receive, store, or decrypt your HA credentials.
            </p>
          </div>

          {/* Data map */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Local */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Icon path={mdiCloudOffOutline} className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Stays on your device</p>
                  <p className="text-xs text-emerald-600/70">Default · all plans</p>
                </div>
              </div>
              <ul className="space-y-2.5">
                <CheckItem color="emerald">HA OAuth tokens (encrypted in browser storage)</CheckItem>
                <CheckItem color="emerald">HA base URL (unless you opt into cloud sync)</CheckItem>
                <CheckItem color="emerald">Decryption keys — never transmitted anywhere</CheckItem>
              </ul>
            </div>

            {/* Server */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 bg-slate-200 rounded-lg flex items-center justify-center">
                  <Icon path={mdiDatabase} className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Stored by CasaBoard</p>
                  <p className="text-xs text-slate-400">All protected by Supabase RLS</p>
                </div>
              </div>
              <ul className="space-y-2.5">
                <CheckItem color="slate">Dashboard & page layouts</CheckItem>
                <CheckItem color="slate">Account & subscription info</CheckItem>
                <CheckItem color="slate">
                  HA instance name + URL{" "}
                  <span className="text-slate-400 font-medium">(paid cloud sync only, opt-in)</span>
                </CheckItem>
              </ul>
            </div>
          </div>
        </section>

        {/* ── 02 · Direct connection ── */}
        <section>
          <SectionLabel n="02" label="Direct connection" />
          <p className="text-slate-600 mb-8 max-w-2xl">
            When you open a dashboard, your browser decrypts the HA token locally and opens a WebSocket
            directly to your Home Assistant instance. Live entity data flows between your device and
            Home Assistant — CasaBoard servers are not in the path.
          </p>

          {/* Flow diagram */}
          <div className="flex flex-col sm:flex-row items-center gap-0 sm:gap-0 rounded-2xl overflow-hidden border border-slate-100">
            <div className="flex-1 bg-white p-6 text-center">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon path={mdiLanConnect} className="w-5 h-5 text-violet-600" />
              </div>
              <p className="font-semibold text-slate-900 text-sm mb-0.5">Your Browser</p>
              <p className="text-xs text-slate-400">Decrypts token locally</p>
            </div>

            <div className="flex flex-row sm:flex-col items-center justify-center px-4 py-4 sm:py-6 bg-emerald-50 border-y sm:border-y-0 sm:border-x border-emerald-100 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Icon path={mdiArrowRight} className="w-4 h-4 text-emerald-500 rotate-90 sm:rotate-0" />
                <div className="text-center">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">WebSocket</p>
                  <p className="text-xs text-emerald-600/70">Direct · no proxy</p>
                </div>
                <Icon path={mdiArrowRight} className="w-4 h-4 text-emerald-500 rotate-90 sm:rotate-0" />
              </div>
            </div>

            <div className="flex-1 bg-white p-6 text-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon path={mdiServer} className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="font-semibold text-slate-900 text-sm mb-0.5">Your Home Assistant</p>
              <p className="text-xs text-slate-400">On your network</p>
            </div>

            {/* CasaBoard — NOT in the path */}
            <div className="hidden sm:flex flex-col items-center absolute pointer-events-none" aria-hidden>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2.5 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <Icon path={mdiWifiOff} className="w-4 h-4 text-slate-400 shrink-0" />
            <p className="text-xs text-slate-500">
              <strong className="text-slate-700">CasaBoard servers are not in this diagram.</strong>{" "}
              We have no route to intercept or read live entity data from your home.
            </p>
          </div>
        </section>

        {/* ── 03 · Token encryption ── */}
        <section>
          <SectionLabel n="03" label="Token encryption" />
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 items-start">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">How HA tokens are protected</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                When you authorise Home Assistant, the OAuth flow completes in your browser. The resulting
                tokens are encrypted immediately using the Web Crypto API and written to local storage.
                They are decrypted only in your session when a dashboard needs to connect to HA.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Clearing browser data or signing in on a new device requires re-authenticating with Home
                Assistant — this is intentional. It means no credentials are silently migrated through our
                servers.
              </p>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Encryption spec
              </p>
              <SpecRow label="algorithm" value="AES-GCM" />
              <SpecRow label="key-length" value="256-bit" />
              <SpecRow label="key-derivation" value="Tied to your account identity" />
              <SpecRow label="iv" value="Random per encryption (browser crypto)" />
              <SpecRow label="api" value="Web Crypto API (W3C standard)" />
              <SpecRow label="storage" value="Browser localStorage only" />
              <SpecRow label="server-copy" value="None — never transmitted" />
            </div>
          </div>
        </section>

        {/* ── 04 · Database & authentication ── */}
        <section>
          <SectionLabel n="04" label="Database & authentication" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Icon path={mdiDatabaseLock} className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Row Level Security</h3>
                  <p className="text-xs text-slate-400">Supabase / PostgreSQL</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Every table in our database enforces RLS — a built-in PostgreSQL feature that makes every
                query automatically include <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">WHERE auth.uid() = user_id</code>.
                Even if a query tried to read all rows, the database would only return your own records.
              </p>
              <p className="text-xs text-slate-400">Applies to: pages, sidebars, billing, and optional HA metadata.</p>
            </div>

            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
                  <Icon path={mdiAccountKey} className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Authentication</h3>
                  <p className="text-xs text-slate-400">Supabase Auth</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                CasaBoard uses Supabase Auth for account management. Sessions are handled via JWT tokens
                with automatic rotation. All API requests require a valid, verified session — there is no
                unauthenticated path to user data.
              </p>
              <ul className="space-y-1.5">
                <CheckItem color="emerald">OAuth sign-in (Google)</CheckItem>
                <CheckItem color="emerald">JWT session management</CheckItem>
                <CheckItem color="emerald">Middleware protection on all routes</CheckItem>
              </ul>
            </div>
          </div>
        </section>

        {/* ── 05 · Optional cloud sync ── */}
        <section>
          <SectionLabel n="05" label="Optional cloud sync" />
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 items-start">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">What cloud sync actually stores</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Available on paid plans, cloud sync lets you see the same Home Assistant instances when
                you sign in from a different device. It stores <em>metadata only</em> — the display name
                and base URL you gave an instance — so you don&apos;t have to re-enter it.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                OAuth tokens are not included. You&apos;ll still need to re-authorise Home Assistant on each
                new device. Cloud sync removes the URL lookup, not the security step.
              </p>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">Cloud sync stores</p>
                <ul className="space-y-1.5">
                  <CheckItem color="emerald">HA instance display name</CheckItem>
                  <CheckItem color="emerald">HA base URL</CheckItem>
                </ul>
              </div>
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">Cloud sync never stores</p>
                <ul className="space-y-1.5">
                  <CheckItem color="red">HA OAuth tokens or refresh tokens</CheckItem>
                  <CheckItem color="red">Passwords or HA admin credentials</CheckItem>
                  <CheckItem color="red">Entity states or smart home data</CheckItem>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── 06 · Developer transparency ── */}
        <section>
          <SectionLabel n="06" label="Developer transparency" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">What the CasaBoard team can see</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-2xl">
            For support and debugging, certain data is visible to the team. Here&apos;s what that includes
            — and what it structurally cannot include.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">We can access</p>
              <ul className="space-y-2.5">
                <CheckItem color="slate">Account & billing — email, plan, subscription status</CheckItem>
                <CheckItem color="slate">Dashboard metadata — page names, slugs, layout JSON</CheckItem>
                <CheckItem color="slate">Optional cloud sync rows — HA instance name and URL only</CheckItem>
                <CheckItem color="slate">Error logs and analytics — scrubbed of sensitive values</CheckItem>
              </ul>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">We cannot access</p>
              <ul className="space-y-2.5">
                <CheckItem color="red">HA OAuth tokens — not stored in our infrastructure in default mode</CheckItem>
                <CheckItem color="red">Your HA server, devices, entities, or automations</CheckItem>
                <CheckItem color="red">Live smart home state — data flows browser↔HA, not through us</CheckItem>
                <CheckItem color="red">Other users&apos; data — RLS prevents cross-account queries at the database level</CheckItem>
              </ul>
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="bg-slate-50 border border-slate-100 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
              <Icon path={mdiEmail} className="w-5 h-5 text-violet-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Questions about security?</h2>
              <p className="text-slate-500 text-sm mb-5">
                If you have specific questions, found a potential issue, or want a deeper technical
                explanation of any of the above, reach out directly.
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
                  <Icon path={mdiArrowRight} className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-6 pt-5 border-t border-slate-200">
            Last reviewed April 2026. This page is updated whenever our data handling practices change.
          </p>
        </section>

      </div>
    </>
  );
}
