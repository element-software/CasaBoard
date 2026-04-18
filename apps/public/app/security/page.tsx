import Icon from "@mdi/react";
import { 
  mdiShieldCheck, 
  mdiLock, 
  mdiDatabase, 
  mdiKey, 
  mdiEyeOff, 
  mdiShieldAccount, 
  mdiShieldLock, 
  mdiDatabaseLock,
  mdiAccountKey,
  mdiShieldStar,
  mdiSecurity,
  mdiShieldCrown,
  mdiCheckCircle,
  mdiAlertCircle,
  mdiInformation,
  mdiEmail,
  mdiWeb,
  mdiCloud,
  mdiServer,
  mdiShieldOutline,
  mdiLockOutline,
  mdiDatabaseOutline
} from "@mdi/js";

export default function SecurityPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16">

      {/* ── Hero banner ── */}
      <div className="relative rounded-2xl overflow-hidden mb-14">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-700 via-violet-800 to-indigo-900" />
        {/* Radial mesh */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 15% 60%, rgba(167,139,250,0.35) 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, rgba(99,102,241,0.40) 0%, transparent 55%)",
          }}
        />
        {/* SVG grain texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Content */}
        <div className="relative z-10 px-8 sm:px-14 py-16 sm:py-20 text-center">
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
            Your Home Assistant tokens stay encrypted in your browser. We never see your credentials—by architecture, not just policy.
          </p>
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: mdiLock, label: "AES-256 Encrypted" },
              { icon: mdiShieldCheck, label: "Local-first" },
              { icon: mdiEyeOff, label: "Zero server access" },
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

      {/* Overview Section */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Icon path={mdiShieldStar} className="w-8 h-8 text-violet-600" />
          <h2 className="text-2xl font-semibold text-slate-900">Security Overview</h2>
        </div>
        <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6 mb-6">
          <p className="text-slate-600 mb-4">
            By default, nothing that lets CasaBoard log into Home Assistant on your behalf is stored in
            our database. Your OAuth tokens are encrypted and kept in the browser. We still protect your
            account, billing, and dashboard layouts with authentication and Row Level Security like any
            serious SaaS product.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon path={mdiLock} className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-medium text-slate-900">What stays on your device (default)</h3>
              </div>
              <ul className="text-slate-600 space-y-2">
                <li className="flex items-center gap-2">
                  <Icon path={mdiKey} className="w-4 h-4 text-green-400" />
                  Home Assistant OAuth tokens (encrypted in browser storage)
                </li>
                <li className="flex items-center gap-2">
                  <Icon path={mdiWeb} className="w-4 h-4 text-green-400" />
                  Your HA base URL, unless you enable optional cloud sync
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon path={mdiDatabase} className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-medium text-slate-900">What we host for you</h3>
              </div>
              <ul className="text-slate-600 space-y-2">
                <li className="flex items-center gap-2">
                  <Icon path={mdiDatabase} className="w-4 h-4 text-green-400" />
                  Dashboard and page layouts (e.g. Puck JSON), sidebars, publishing flags
                </li>
                <li className="flex items-center gap-2">
                  <Icon path={mdiAccountKey} className="w-4 h-4 text-green-400" />
                  Account and subscription metadata tied to your login
                </li>
                <li className="flex items-center gap-2">
                  <Icon path={mdiCloud} className="w-4 h-4 text-green-400" />
                  <span>
                    <strong>Optional:</strong> HA instance label + URL, only if you are on a paid plan
                    and turn on &quot;cloud sync&quot; in settings
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Local vs cloud */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Icon path={mdiShieldLock} className="w-8 h-8 text-violet-600" />
          <h2 className="text-2xl font-semibold text-slate-900">Local-first vs optional cloud sync</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Default (everyone)</h3>
            <p className="text-slate-600 text-sm mb-3">
              Home Assistant authentication completes in your browser. Tokens are encrypted with Web
              Crypto and stored locally; they are not written to CasaBoard databases. Your HA URL is also
              kept in the browser unless you choose otherwise.
            </p>
            <ul className="text-slate-600 text-sm space-y-1">
              <li>• No HA access tokens on our servers</li>
              <li>• No HA URL in our database</li>
              <li>• Same connection model on free and paid tiers unless you opt in below</li>
            </ul>
          </div>
          <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Optional cloud sync (paid, opt-in)</h3>
            <p className="text-slate-600 text-sm mb-3">
              If your plan supports it and you enable cloud sync in settings, we can store{" "}
              <strong>metadata only</strong>—display name and base URL for each Home Assistant instance—so
              you can see the same instances when you sign in from another device.
            </p>
            <ul className="text-slate-600 text-sm space-y-1">
              <li>• OAuth tokens remain encrypted and local; we do not store HA passwords or tokens in the cloud</li>
              <li>• You can turn cloud sync off; local-only mode continues to work</li>
              <li>• Row Level Security ensures only your user rows are readable</li>
            </ul>
          </div>
        </div>
      </section>

      {/* What we never touch */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Icon path={mdiEyeOff} className="w-8 h-8 text-violet-600" />
          <h2 className="text-2xl font-semibold text-slate-900">What CasaBoard cannot access</h2>
        </div>
        <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6">
          <ul className="text-slate-600 space-y-2">
            <li className="flex items-center gap-2">
              <Icon path={mdiServer} className="w-4 h-4 text-red-400" />
              Your Home Assistant server directly (we are not a proxy into HA)
            </li>
            <li className="flex items-center gap-2">
              <Icon path={mdiShieldOutline} className="w-4 h-4 text-red-400" />
              Your smart home devices, entities, or automations inside HA
            </li>
            <li className="flex items-center gap-2">
              <Icon path={mdiDatabaseOutline} className="w-4 h-4 text-red-400" />
              Home Assistant logs, history, or backups
            </li>
            <li className="flex items-center gap-2">
              <Icon path={mdiLockOutline} className="w-4 h-4 text-red-400" />
              Decrypted HA tokens in our infrastructure—those keys never leave your browser by design</li>
          </ul>
        </div>
      </section>

      {/* Technical Security Measures */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Icon path={mdiSecurity} className="w-8 h-8 text-violet-600" />
          <h2 className="text-2xl font-semibold text-slate-900">Technical Security Measures</h2>
        </div>
        
        <div className="space-y-6">
          {/* Encryption */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon path={mdiLock} className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-slate-900">Token encryption in your browser</h3>
            </div>
            <p className="text-slate-600 mb-4">
              Home Assistant OAuth tokens are encrypted using industry-standard{" "}
              <strong>AES-GCM</strong> in the browser before being written to{" "}
              <strong>local storage</strong>. They are not persisted in CasaBoard application databases
              in the default configuration. Decryption happens only in your session when connecting to
              Home Assistant.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Encryption details:</h4>
                <ul className="text-slate-600 space-y-1">
                  <li>• Algorithm: AES-GCM 256-bit</li>
                  <li>• Key derivation tied to your account identity</li>
                  <li>• Random IV for each encryption</li>
                  <li>• Web Crypto API (browser-native)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-2">What this means:</h4>
                <ul className="text-slate-600 space-y-1">
                  <li>• Server-side code does not hold a copy of your HA tokens</li>
                  <li>• Clearing browser data or a new device requires signing in to HA again</li>
                  <li>• Optional cloud sync does not change where tokens live</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Database Security */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon path={mdiDatabaseLock} className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-slate-900">Database Security with Supabase</h3>
            </div>
            <p className="text-slate-600 mb-4">
              Our database is powered by <strong>Supabase</strong> (built on PostgreSQL) and uses{" "}
              <strong>Row Level Security (RLS)</strong> so each query only returns rows owned by the
              signed-in user. That applies to pages, sidebars, billing, and—if you use it—optional HA
              instance metadata for cloud sync. It does <strong>not</strong> apply to HA tokens, because
              those are not stored in the app database by default.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Supabase RLS Policies:</h4>
                <ul className="text-slate-600 space-y-1">
                  <li>• Database-level access control</li>
                  <li>• User-specific data isolation</li>
                  <li>• No admin bypass mechanisms</li>
                  <li>• Automatic user filtering on all queries</li>
                  <li>• Policy: <code>auth.uid() = user_id</code></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Data protection:</h4>
                <ul className="text-slate-600 space-y-1">
                  <li>• Encrypted at rest (Supabase / PostgreSQL)</li>
                  <li>• No HA access tokens in our tables in default local mode</li>
                  <li>• Optional cloud sync rows contain URL/name only, not OAuth secrets</li>
                  <li>• Automatic cleanup on account deletion where applicable</li>
                  <li>• Supabase&apos;s operational security posture</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-2">How RLS Works:</h4>
              <p className="text-slate-600 text-sm">
                Every database query automatically includes a filter like <code>WHERE auth.uid() = user_id</code>. 
                This means even if we tried to query all users&apos; data, the database would only return 
                records belonging to the authenticated user. This protection is built into the database itself.
              </p>
            </div>
          </div>

          {/* Authentication */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon path={mdiAccountKey} className="w-6 h-6 text-orange-400" />
              <h3 className="text-xl font-semibold text-slate-900">Authentication & Authorization</h3>
            </div>
            <p className="text-slate-600 mb-4">
              Every request to your data requires valid authentication. We use <strong>Supabase Auth</strong> 
              for secure user management and session handling, which provides enterprise-grade security 
              and is trusted by thousands of applications worldwide.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Supabase Authentication:</h4>
                <ul className="text-slate-600 space-y-1">
                  <li>• Industry-standard JWT tokens</li>
                  <li>• Secure session management</li>
                  <li>• Automatic token refresh</li>
                  <li>• Multi-factor authentication support</li>
                  <li>• OAuth providers (Google, GitHub, etc.)</li>
                  <li>• Password reset and email verification</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Authorization & RLS:</h4>
                <ul className="text-slate-600 space-y-1">
                  <li>• Every API call requires valid user session</li>
                  <li>• User ID verification on all operations</li>
                  <li>• No cross-user data access possible</li>
                  <li>• Middleware protection on all routes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Access */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Icon path={mdiShieldAccount} className="w-8 h-8 text-violet-600" />
          <h2 className="text-2xl font-semibold text-slate-900">Developer Access & Transparency</h2>
        </div>
        
        <div className="bg-red-50 border border-red-100 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon path={mdiAlertCircle} className="w-6 h-6 text-red-500" />
            <h3 className="text-xl font-semibold text-red-700">We Cannot Access Your Data</h3>
          </div>
          <p className="text-slate-600 mb-4">
            In the default configuration, CasaBoard never receives your Home Assistant OAuth tokens at
            our servers. They exist only in encrypted form in your browser. We cannot decrypt them
            remotely because we do not host them. If you enable optional cloud sync, we may store your
            HA base URL (not credentials) under your user ID—still subject to RLS and never including
            tokens.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-red-700 mb-2">What we cannot do:</h4>
              <ul className="text-slate-600 space-y-1">
                <li>• Access or decrypt HA tokens in default local mode (we don&apos;t have them)</li>
                <li>• Log into your Home Assistant as you</li>
                <li>• Bypass Supabase authentication or RLS for other users&apos; data</li>
                <li>• Read your smart home state from our infrastructure</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-700 mb-2">Technical barriers:</h4>
              <ul className="text-slate-600 space-y-1">
                <li>• Browser-local encryption for tokens</li>
                <li>• Supabase Row Level Security on all persisted app data</li>
                <li>• Separation of concerns: HA auth lives in the client, not the API layer</li>
                <li>• No admin bypass for end-user smart home data</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon path={mdiInformation} className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-semibold text-slate-900">What We Can See (Limited)</h3>
          </div>
          <p className="text-slate-600 mb-4">
            For debugging and support we may see:
          </p>
          <ul className="text-slate-600 space-y-2">
            <li>• <strong>Account & billing</strong> — email, plan, subscription status, as needed for support</li>
            <li>• <strong>Dashboard metadata</strong> — page names, slugs, layout structure (not live HA state)</li>
            <li>• <strong>Optional cloud HA rows</strong> — only if you enabled cloud sync (instance name and URL)</li>
            <li>• <strong>Error logs & analytics</strong> — scrubbed of secrets; used to improve reliability</li>
          </ul>
          <p className="text-slate-600 text-sm mt-3">
            We do not have access to plaintext Home Assistant tokens in our databases or logs in the
            default local-first configuration.
          </p>
        </div>
      </section>

      {/* Data Flow */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Icon path={mdiCloud} className="w-8 h-8 text-violet-600" />
          <h2 className="text-2xl font-semibold text-slate-900">How Your Data Flows</h2>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Sign in & connect Home Assistant</h3>
            </div>
            <p className="text-slate-600">
              You authenticate to CasaBoard (e.g. Supabase Auth). When you connect Home Assistant, the
              OAuth flow completes in your browser. Tokens are encrypted and written to browser storage;
              by default CasaBoard servers never receive or store those tokens.
            </p>
          </div>

          <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Using your dashboard</h3>
            </div>
            <p className="text-slate-600">
              When you open a dashboard, the app loads encrypted tokens from local storage, decrypts
              them in the browser, and opens a WebSocket connection from your device to your Home
              Assistant instance. Live entity data flows between your browser and HA—not through our
              database as a proxy.
            </p>
          </div>

          <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">What we persist</h3>
            </div>
            <p className="text-slate-600">
              We save your layout JSON, page settings, and account data in Supabase. If you opt into
              cloud sync on a paid plan, we may also save HA instance metadata (name + URL) for
              convenience. Your HA access tokens remain local-only unless our product model changes
              and we document it here.
            </p>
          </div>
        </div>
      </section>

      {/* Supabase Security */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Icon path={mdiShieldCrown} className="w-8 h-8 text-violet-600" />
          <h2 className="text-2xl font-semibold text-slate-900">Powered by Supabase Security</h2>
        </div>
        
        <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon path={mdiServer} className="w-6 h-6 text-indigo-400" />
            <h3 className="text-xl font-semibold text-slate-900">Enterprise-Grade Infrastructure</h3>
          </div>
          <p className="text-slate-600 mb-4">
            CasaBoard is built on <strong>Supabase</strong>, a trusted platform used by thousands of applications 
            worldwide. Supabase provides enterprise-grade security, compliance, and infrastructure that we leverage 
            to protect your data.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Authentication</h4>
              <ul className="text-slate-600 space-y-1 text-sm">
                <li>• JWT-based authentication</li>
                <li>• OAuth providers (Google, GitHub)</li>
                <li>• Multi-factor authentication</li>
                <li>• Secure session management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Database Security</h4>
              <ul className="text-slate-600 space-y-1 text-sm">
                <li>• PostgreSQL with RLS</li>
                <li>• Encrypted connections (TLS)</li>
                <li>• Automatic backups</li>
                <li>• Point-in-time recovery</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Infrastructure</h4>
              <ul className="text-slate-600 space-y-1 text-sm">
                <li>• AWS infrastructure</li>
                <li>• SOC 2 Type II compliant</li>
                <li>• GDPR compliant</li>
                <li>• Regular security audits</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Standards */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Icon path={mdiShieldLock} className="w-8 h-8 text-violet-600" />
          <h2 className="text-2xl font-semibold text-slate-900">Security Standards & Compliance</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Icon path={mdiCheckCircle} className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-slate-900">Security Standards</h3>
            </div>
            <ul className="text-slate-600 space-y-2">
              <li>• AES-GCM encryption (FIPS 140-2 compliant)</li>
              <li>• PBKDF2 key derivation (OWASP recommended)</li>
              <li>• Web Crypto API (W3C standard)</li>
              <li>• HTTPS everywhere (TLS 1.2+)</li>
              <li>• Secure session management</li>
            </ul>
          </div>
          
          <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Icon path={mdiShieldStar} className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-slate-900">Best Practices</h3>
            </div>
            <ul className="text-slate-600 space-y-2">
              <li>• Principle of least privilege</li>
              <li>• Defense in depth</li>
              <li>• Regular security audits</li>
              <li>• No hardcoded secrets</li>
              <li>• Secure development lifecycle</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact & Support */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Icon path={mdiEmail} className="w-8 h-8 text-violet-600" />
          <h2 className="text-2xl font-semibold text-slate-900">Questions or Concerns?</h2>
        </div>
        
        <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6">
          <p className="text-slate-600 mb-4">
            We understand that security and privacy are paramount when it comes to your smart home. 
            If you have any questions about our security measures or would like more technical details, 
            please don&apos;t hesitate to reach out.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:support@casaboard.dev"
              className="inline-flex items-center justify-center px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              Email Us
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <div className="text-center text-sm text-slate-600">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
        <p className="mt-2">
          This security documentation is regularly reviewed and updated to reflect our current practices.
        </p>
      </div>
    </div>
  );
}
