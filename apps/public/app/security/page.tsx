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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-48">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-theme-primary/10 rounded-full">
            <Icon path={mdiShieldCheck} className="w-16 h-16 text-theme-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-theme-text mb-4">Security & Privacy</h1>
        <p className="text-xl text-theme-text-secondary max-w-2xl mx-auto">
          Your Home Assistant credentials and data are protected by multiple layers of security. 
          We cannot access your Home Assistant instance, even as the developers.
        </p>
      </div>

      {/* Overview Section */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Icon path={mdiShieldStar} className="w-8 h-8 text-theme-primary" />
          <h2 className="text-2xl font-semibold text-theme-text">Security Overview</h2>
        </div>
        <div className="bg-theme-background/50 border border-theme-border/30 rounded-lg p-6 mb-6">
          <p className="text-theme-text-secondary mb-4">
            CasaBoard is designed with privacy and security as core principles. We believe that your 
            smart home data should remain private and that you should have complete control over your 
            Home Assistant instance.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon path={mdiLock} className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-medium text-theme-text">What We Protect</h3>
              </div>
              <ul className="text-theme-text-secondary space-y-2">
                <li className="flex items-center gap-2">
                  <Icon path={mdiKey} className="w-4 h-4 text-green-400" />
                  Your Home Assistant access tokens
                </li>
                <li className="flex items-center gap-2">
                  <Icon path={mdiWeb} className="w-4 h-4 text-green-400" />
                  Your Home Assistant URL and credentials
                </li>
                <li className="flex items-center gap-2">
                  <Icon path={mdiDatabase} className="w-4 h-4 text-green-400" />
                  Your dashboard configurations
                </li>
                <li className="flex items-center gap-2">
                  <Icon path={mdiAccountKey} className="w-4 h-4 text-green-400" />
                  Your personal data and preferences
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon path={mdiEyeOff} className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-medium text-theme-text">What We Cannot Access</h3>
              </div>
              <ul className="text-theme-text-secondary space-y-2">
                <li className="flex items-center gap-2">
                  <Icon path={mdiServer} className="w-4 h-4 text-red-400" />
                  Your Home Assistant instance directly
                </li>
                <li className="flex items-center gap-2">
                  <Icon path={mdiShieldOutline} className="w-4 h-4 text-red-400" />
                  Your smart home devices or their data
                </li>
                <li className="flex items-center gap-2">
                  <Icon path={mdiDatabaseOutline} className="w-4 h-4 text-red-400" />
                  Your Home Assistant logs or history
                </li>
                <li className="flex items-center gap-2">
                  <Icon path={mdiLockOutline} className="w-4 h-4 text-red-400" />
                  Any data outside of CasaBoard
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Security Measures */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Icon path={mdiSecurity} className="w-8 h-8 text-theme-primary" />
          <h2 className="text-2xl font-semibold text-theme-text">Technical Security Measures</h2>
        </div>
        
        <div className="space-y-6">
          {/* Encryption */}
          <div className="bg-theme-background/50 border border-theme-border/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon path={mdiLock} className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-theme-text">End-to-End Encryption</h3>
            </div>
            <p className="text-theme-text-secondary mb-4">
              Your Home Assistant credentials are encrypted using industry-standard AES-GCM encryption 
              with 256-bit keys before being stored in our database.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-theme-text mb-2">Encryption Details:</h4>
                <ul className="text-theme-text-secondary space-y-1">
                  <li>• Algorithm: AES-GCM 256-bit</li>
                  <li>• Key Derivation: PBKDF2 with 100,000 iterations</li>
                  <li>• Hash Function: SHA-256</li>
                  <li>• Random IV for each encryption</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-theme-text mb-2">Key Security:</h4>
                <ul className="text-theme-text-secondary space-y-1">
                  <li>• Keys derived from your user data</li>
                  <li>• Unique session identifiers</li>
                  <li>• Cannot be decrypted without your account</li>
                  <li>• Web Crypto API (browser-native)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Database Security */}
          <div className="bg-theme-background/50 border border-theme-border/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon path={mdiDatabaseLock} className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-theme-text">Database Security with Supabase</h3>
            </div>
            <p className="text-theme-text-secondary mb-4">
              Our database is powered by <strong>Supabase</strong> (built on PostgreSQL) and uses 
              <strong> Row Level Security (RLS)</strong> to ensure that you can only access your own data. 
              RLS is enforced at the database level, meaning even if someone gained direct database access, 
              they could only see their own records.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-theme-text mb-2">Supabase RLS Policies:</h4>
                <ul className="text-theme-text-secondary space-y-1">
                  <li>• Database-level access control</li>
                  <li>• User-specific data isolation</li>
                  <li>• No admin bypass mechanisms</li>
                  <li>• Automatic user filtering on all queries</li>
                  <li>• Policy: <code>auth.uid() = user_id</code></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-theme-text mb-2">Data Protection:</h4>
                <ul className="text-theme-text-secondary space-y-1">
                  <li>• Encrypted at rest in database</li>
                  <li>• No plaintext credential storage</li>
                  <li>• Automatic data cleanup on account deletion</li>
                  <li>• Regular security audits</li>
                  <li>• Supabase&apos;s enterprise security</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <h4 className="font-medium text-blue-300 mb-2">How RLS Works:</h4>
              <p className="text-blue-200 text-sm">
                Every database query automatically includes a filter like <code>WHERE auth.uid() = user_id</code>. 
                This means even if we tried to query all users&apos; data, the database would only return 
                records belonging to the authenticated user. This protection is built into the database itself.
              </p>
            </div>
          </div>

          {/* Authentication */}
          <div className="bg-theme-background/50 border border-theme-border/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon path={mdiAccountKey} className="w-6 h-6 text-orange-400" />
              <h3 className="text-xl font-semibold text-theme-text">Authentication & Authorization</h3>
            </div>
            <p className="text-theme-text-secondary mb-4">
              Every request to your data requires valid authentication. We use <strong>Supabase Auth</strong> 
              for secure user management and session handling, which provides enterprise-grade security 
              and is trusted by thousands of applications worldwide.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-theme-text mb-2">Supabase Authentication:</h4>
                <ul className="text-theme-text-secondary space-y-1">
                  <li>• Industry-standard JWT tokens</li>
                  <li>• Secure session management</li>
                  <li>• Automatic token refresh</li>
                  <li>• Multi-factor authentication support</li>
                  <li>• OAuth providers (Google, GitHub, etc.)</li>
                  <li>• Password reset and email verification</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-theme-text mb-2">Authorization & RLS:</h4>
                <ul className="text-theme-text-secondary space-y-1">
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
          <Icon path={mdiShieldAccount} className="w-8 h-8 text-theme-primary" />
          <h2 className="text-2xl font-semibold text-theme-text">Developer Access & Transparency</h2>
        </div>
        
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon path={mdiAlertCircle} className="w-6 h-6 text-red-400" />
            <h3 className="text-xl font-semibold text-red-400">We Cannot Access Your Data</h3>
          </div>
          <p className="text-red-200 mb-4">
            As the developers of CasaBoard, we have implemented multiple security layers that prevent us 
            from accessing your Home Assistant instance or credentials, even if we wanted to.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-red-300 mb-2">What We Cannot Do:</h4>
              <ul className="text-red-200 space-y-1">
                <li>• Access your Home Assistant credentials</li>
                <li>• Decrypt your stored tokens</li>
                <li>• Bypass authentication systems</li>
                <li>• Access your HA instance directly</li>
                <li>• See other users&apos; data</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-300 mb-2">Technical Barriers:</h4>
              <ul className="text-red-200 space-y-1">
                <li>• User-specific encryption keys</li>
                <li>• Supabase Row Level Security policies</li>
                <li>• No admin bypass mechanisms</li>
                <li>• No service account access</li>
                <li>• No backdoor access patterns</li>
                <li>• Supabase&apos;s built-in access controls</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-theme-background/50 border border-theme-border/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon path={mdiInformation} className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-semibold text-theme-text">What We Can See (Limited)</h3>
          </div>
          <p className="text-theme-text-secondary mb-4">
            For debugging and support purposes, we can only see:
          </p>
          <ul className="text-theme-text-secondary space-y-2">
            <li>• <strong>Encrypted data structure</strong> - We can see that encrypted data exists, but not its contents</li>
            <li>• <strong>Error logs</strong> - To help troubleshoot issues (no sensitive data included)</li>
            <li>• <strong>Usage statistics</strong> - Anonymous analytics to improve the service</li>
            <li>• <strong>Account information</strong> - Basic account details for support (email, subscription status)</li>
          </ul>
        </div>
      </section>

      {/* Data Flow */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Icon path={mdiCloud} className="w-8 h-8 text-theme-primary" />
          <h2 className="text-2xl font-semibold text-theme-text">How Your Data Flows</h2>
        </div>
        
        <div className="space-y-4">
          <div className="bg-theme-background/50 border border-theme-border/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <h3 className="text-lg font-semibold text-theme-text">Initial Setup</h3>
            </div>
            <p className="text-theme-text-secondary">
              When you connect your Home Assistant instance, your credentials are encrypted using your 
              unique user data and stored in our database. The encryption key is derived from your 
              account information and cannot be recreated by anyone else.
            </p>
          </div>
          
          <div className="bg-theme-background/50 border border-theme-border/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <h3 className="text-lg font-semibold text-theme-text">Daily Usage</h3>
            </div>
            <p className="text-theme-text-secondary">
              When you use CasaBoard, your encrypted credentials are retrieved from the database, 
              decrypted using your account-specific key, and used to communicate with your Home 
              Assistant instance. The decrypted data never leaves your browser session.
            </p>
          </div>
          
          <div className="bg-theme-background/50 border border-theme-border/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <h3 className="text-lg font-semibold text-theme-text">Data Storage</h3>
            </div>
            <p className="text-theme-text-secondary">
              All sensitive data is encrypted before being stored. Your dashboard configurations 
              and preferences are also protected, though they don&apos;t contain sensitive credentials.
            </p>
          </div>
        </div>
      </section>

      {/* Supabase Security */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Icon path={mdiShieldCrown} className="w-8 h-8 text-theme-primary" />
          <h2 className="text-2xl font-semibold text-theme-text">Powered by Supabase Security</h2>
        </div>
        
        <div className="bg-theme-background/50 border border-theme-border/30 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon path={mdiServer} className="w-6 h-6 text-indigo-400" />
            <h3 className="text-xl font-semibold text-theme-text">Enterprise-Grade Infrastructure</h3>
          </div>
          <p className="text-theme-text-secondary mb-4">
            CasaBoard is built on <strong>Supabase</strong>, a trusted platform used by thousands of applications 
            worldwide. Supabase provides enterprise-grade security, compliance, and infrastructure that we leverage 
            to protect your data.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-theme-text mb-2">Authentication</h4>
              <ul className="text-theme-text-secondary space-y-1 text-sm">
                <li>• JWT-based authentication</li>
                <li>• OAuth providers (Google, GitHub)</li>
                <li>• Multi-factor authentication</li>
                <li>• Secure session management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-theme-text mb-2">Database Security</h4>
              <ul className="text-theme-text-secondary space-y-1 text-sm">
                <li>• PostgreSQL with RLS</li>
                <li>• Encrypted connections (TLS)</li>
                <li>• Automatic backups</li>
                <li>• Point-in-time recovery</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-theme-text mb-2">Infrastructure</h4>
              <ul className="text-theme-text-secondary space-y-1 text-sm">
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
          <Icon path={mdiShieldLock} className="w-8 h-8 text-theme-primary" />
          <h2 className="text-2xl font-semibold text-theme-text">Security Standards & Compliance</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-theme-background/50 border border-theme-border/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Icon path={mdiCheckCircle} className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-theme-text">Security Standards</h3>
            </div>
            <ul className="text-theme-text-secondary space-y-2">
              <li>• AES-GCM encryption (FIPS 140-2 compliant)</li>
              <li>• PBKDF2 key derivation (OWASP recommended)</li>
              <li>• Web Crypto API (W3C standard)</li>
              <li>• HTTPS everywhere (TLS 1.2+)</li>
              <li>• Secure session management</li>
            </ul>
          </div>
          
          <div className="bg-theme-background/50 border border-theme-border/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Icon path={mdiShieldStar} className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-theme-text">Best Practices</h3>
            </div>
            <ul className="text-theme-text-secondary space-y-2">
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
          <Icon path={mdiEmail} className="w-8 h-8 text-theme-primary" />
          <h2 className="text-2xl font-semibold text-theme-text">Questions or Concerns?</h2>
        </div>
        
        <div className="bg-theme-background/50 border border-theme-border/30 rounded-lg p-6">
          <p className="text-theme-text-secondary mb-4">
            We understand that security and privacy are paramount when it comes to your smart home. 
            If you have any questions about our security measures or would like more technical details, 
            please don&apos;t hesitate to reach out.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:support@casaboard.dev"
              className="inline-flex items-center justify-center px-6 py-3 bg-theme-primary text-white rounded-lg hover:bg-theme-primary/90 transition-colors"
            >
              Email Us
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-theme-border text-theme-text rounded-lg hover:bg-theme-background/50 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <div className="text-center text-sm text-theme-text-secondary">
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
