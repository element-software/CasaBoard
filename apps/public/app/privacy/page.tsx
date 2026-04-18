import Icon from "@mdi/react";
import Link from "next/link";
import {
  mdiShieldAccount,
  mdiEyeOff,
  mdiCheckCircle,
  mdiCookie,
  mdiEmail,
  mdiGoogleAnalytics,
  mdiDatabaseOutline,
} from "@mdi/js";

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="font-mono text-xs text-violet-400 tracking-widest select-none">{n}</span>
      <div className="h-px flex-1 bg-slate-100" />
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
      <Icon path={mdiCheckCircle} className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
      {children}
    </li>
  );
}

export default function PrivacyPage() {
  return (
    <>
      {/* ── Full-width hero ── */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-violet-700 via-violet-800 to-indigo-900" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 70%, rgba(167,139,250,0.3) 0%, transparent 55%), radial-gradient(ellipse at 80% 15%, rgba(99,102,241,0.35) 0%, transparent 55%)",
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
              <Icon path={mdiShieldAccount} className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-violet-200/80 text-lg max-w-2xl mx-auto mb-10">
            We collect the minimum data needed to run CasaBoard. Analytics are opt-in. Your
            Home Assistant credentials never touch our servers.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: mdiEyeOff, label: "Minimal collection" },
              { icon: mdiCheckCircle, label: "Never sold" },
              { icon: mdiCookie, label: "Cookie consent" },
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* 01 · What we collect */}
        <section>
          <SectionLabel n="01" label="What we collect" />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-white border border-slate-200 rounded-xl flex items-center justify-center">
                  <Icon path={mdiGoogleAnalytics} className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Analytics</p>
                  <p className="text-xs text-slate-400">Opt-in only</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                If you accept the cookie consent, we collect anonymous usage statistics to understand
                how the product is used and where things go wrong.
              </p>
              <ul className="space-y-2">
                <CheckItem>Anonymous page views and navigation events</CheckItem>
                <CheckItem>General performance metrics</CheckItem>
                <CheckItem>Error and crash reports (scrubbed of personal data)</CheckItem>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-white border border-slate-200 rounded-xl flex items-center justify-center">
                  <Icon path={mdiDatabaseOutline} className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Account data</p>
                  <p className="text-xs text-slate-400">Required to run the service</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                When you sign up, we store the minimum needed to manage your account and dashboards.
              </p>
              <ul className="space-y-2">
                <CheckItem>Email address and basic profile (from OAuth sign-in)</CheckItem>
                <CheckItem>Dashboard and page layouts you create</CheckItem>
                <CheckItem>Subscription and billing status</CheckItem>
                <CheckItem>HA instance name + URL (paid cloud sync only, opt-in)</CheckItem>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-sm text-amber-800">
              <strong>Home Assistant credentials are not included.</strong> Your HA OAuth tokens are
              encrypted and stored only in your browser. They are never transmitted to or stored on
              CasaBoard servers. See our{" "}
              <Link href="/security" className="text-violet-600 hover:underline font-medium">
                Security page
              </Link>{" "}
              for a full explanation.
            </p>
          </div>
        </section>

        {/* 02 · How we use it */}
        <section>
          <SectionLabel n="02" label="How we use your data" />
          <div className="border-l-4 border-slate-200 pl-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">Product improvement</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Anonymous analytics (if you opt in) help us understand which features are used and
                where errors occur. This is never linked to your identity.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">Running the service</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Account and dashboard data is used to provide CasaBoard. We do not use it for
                advertising, profiling, or sell it to third parties.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">Service communications</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We may email you about significant changes to the service, billing, or security. You
                can opt out of product update emails at any time.
              </p>
            </div>
          </div>
        </section>

        {/* 03 · Third parties */}
        <section>
          <SectionLabel n="03" label="Third-party services" />
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            CasaBoard is built on a small set of third-party services. Each handles data under their
            own privacy policies:
          </p>
          <div className="space-y-3">
            {[
              {
                name: "Supabase",
                role: "Database, authentication, and session management",
                note: "Account data and dashboard layouts are stored here. Protected by Row Level Security.",
              },
              {
                name: "Stripe",
                role: "Payment processing",
                note: "Handles all billing. CasaBoard does not store full card numbers or payment details.",
              },
              {
                name: "Google OAuth",
                role: "Sign-in provider",
                note: "Used for account creation and login. We receive your email and basic profile only.",
              },
            ].map((svc) => (
              <div key={svc.name} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-xl">
                <div className="w-1 bg-slate-200 rounded-full shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{svc.name}</p>
                  <p className="text-xs text-slate-400 mb-1">{svc.role}</p>
                  <p className="text-sm text-slate-600">{svc.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 04 · Your choices */}
        <section>
          <SectionLabel n="04" label="Your choices" />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-white border border-slate-100 rounded-2xl">
              <p className="font-semibold text-slate-900 text-sm mb-2">Analytics cookies</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Accept or reject analytics at any time via the cookie consent banner. To reset your
                choice, clear your browser&apos;s local storage for this domain.
              </p>
            </div>
            <div className="p-5 bg-white border border-slate-100 rounded-2xl">
              <p className="font-semibold text-slate-900 text-sm mb-2">Account deletion</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                You can request deletion of your account and all associated data by emailing us.
                Dashboard layouts, billing records, and optional cloud sync rows will be removed.
              </p>
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
              <h2 className="text-lg font-bold text-slate-900 mb-1">Privacy questions</h2>
              <p className="text-slate-500 text-sm mb-5">
                If you have questions about how your data is handled, or would like to request
                deletion, contact us directly.
              </p>
              <a
                href="mailto:support@casaboard.dev"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors"
              >
                <Icon path={mdiEmail} className="w-4 h-4" />
                support@casaboard.dev
              </a>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-6 pt-5 border-t border-slate-200">
            Last reviewed April 2026. This policy is updated when our data practices change.
          </p>
        </section>

      </div>
    </>
  );
}
