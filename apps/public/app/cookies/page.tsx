import Icon from "@mdi/react";
import Link from "next/link";
import {
  mdiCookieOutline,
  mdiShieldCheckOutline,
  mdiGoogleAnalytics,
  mdiEmail,
  mdiCheckCircle,
  mdiCloseCircle,
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

const cookieTable = [
  {
    name: "supabase-auth-token",
    type: "Essential",
    purpose: "Keeps you signed in. Required for the app to function.",
    duration: "Session / persistent",
    canReject: false,
  },
  {
    name: "cookie-consent",
    type: "Essential",
    purpose: "Stores your cookie preference so we don't ask every visit.",
    duration: "1 year",
    canReject: false,
  },
  {
    name: "Analytics cookies",
    type: "Analytics",
    purpose: "Anonymous usage statistics — page views, errors, performance. Opt-in only.",
    duration: "Up to 2 years",
    canReject: true,
  },
];

export default function CookiesPage() {
  return (
    <>
      {/* ── Full-width hero ── */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-violet-700 via-violet-800 to-indigo-900" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 60%, rgba(167,139,250,0.3) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.35) 0%, transparent 55%)",
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
              <Icon path={mdiCookieOutline} className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Cookie Policy
          </h1>
          <p className="text-violet-200/80 text-lg max-w-2xl mx-auto mb-10">
            CasaBoard uses a small number of cookies. Essential ones keep you signed in.
            Analytics are strictly opt-in — you control them.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: mdiShieldCheckOutline, label: "Essential only by default" },
              { icon: mdiGoogleAnalytics, label: "Analytics opt-in" },
              { icon: mdiCheckCircle, label: "No tracking or ads" },
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

        {/* 01 · Cookies we use */}
        <section>
          <SectionLabel n="01" label="Cookies we use" />
          <div className="space-y-3">
            {cookieTable.map((cookie) => (
              <div key={cookie.name} className="bg-white border border-slate-100 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <code className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      {cookie.name}
                    </code>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        cookie.type === "Essential"
                          ? "bg-slate-100 text-slate-600"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {cookie.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {cookie.canReject ? (
                      <>
                        <Icon path={mdiCheckCircle} className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs text-emerald-600 font-medium">Can opt out</span>
                      </>
                    ) : (
                      <>
                        <Icon path={mdiCloseCircle} className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-400">Required</span>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-2">{cookie.purpose}</p>
                <p className="text-xs text-slate-400">Duration: {cookie.duration}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 02 · What we don't use */}
        <section>
          <SectionLabel n="02" label="What we don't use" />
          <div className="border-l-4 border-emerald-200 pl-6 space-y-3">
            {[
              "No advertising or retargeting cookies",
              "No third-party tracking pixels",
              "No cross-site tracking",
              "No fingerprinting or device identification",
              "No cookies that persist Home Assistant credentials",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                <Icon path={mdiCheckCircle} className="w-4 h-4 text-emerald-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* 03 · Managing consent */}
        <section>
          <SectionLabel n="03" label="Managing your consent" />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-white border border-slate-100 rounded-2xl">
              <p className="font-semibold text-slate-900 text-sm mb-2">First visit</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                On your first visit, a consent banner lets you accept or decline analytics cookies.
                Essential cookies are always active — they&apos;re required for sign-in and basic
                functionality.
              </p>
            </div>
            <div className="p-5 bg-white border border-slate-100 rounded-2xl">
              <p className="font-semibold text-slate-900 text-sm mb-2">Changing your mind</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                To reset your cookie preference, clear your browser&apos;s local storage for{" "}
                <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">casaboard.app</code>.
                The consent banner will reappear on your next visit.
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
              <h2 className="text-lg font-bold text-slate-900 mb-1">Cookie questions?</h2>
              <p className="text-slate-500 text-sm mb-5">
                If you have questions about how cookies are used, contact us directly.
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
                  href="/privacy"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:border-violet-200 hover:bg-violet-50 transition-all"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-6 pt-5 border-t border-slate-200">
            Last reviewed April 2026.
          </p>
        </section>

      </div>
    </>
  );
}
