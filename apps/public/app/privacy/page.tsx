export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
      <h1 className="text-3xl font-bold text-theme-text mb-4">Privacy Policy</h1>
      <p className="text-theme-text-secondary mb-6">
        We respect your privacy. CasaBoard collects minimal analytics data when you opt in via the cookie
        consent dialog. This data is used to improve the product experience and is never sold.
      </p>
      <h2 className="text-xl font-semibold text-theme-text mb-2">What we collect</h2>
      <ul className="list-disc pl-6 text-theme-text-secondary mb-6">
        <li>Anonymous usage statistics (page views, general performance and errors)</li>
        <li>Basic diagnostic data to help troubleshoot issues</li>
      </ul>
      <h2 className="text-xl font-semibold text-theme-text mb-2">Your choices</h2>
      <p className="text-theme-text-secondary mb-6">
        You can accept or reject analytics cookies at any time. Clear your browser storage to reset your
        decision.
      </p>
      <p className="text-theme-text-secondary">For questions, contact us at <a className="text-theme-primary" href="mailto:support@casaboard.dev">support@casaboard.dev</a>.</p>
    </div>
  );
}


