export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-theme-text mb-4">Cookie Policy</h1>
      <p className="text-theme-text-secondary mb-6">
        CasaBoard uses a small number of cookies to provide essential functionality and optional analytics.
      </p>
      <h2 className="text-xl font-semibold text-theme-text mb-2">Types of cookies</h2>
      <ul className="list-disc pl-6 text-theme-text-secondary mb-6">
        <li><span className="font-medium text-theme-text">Essential:</span> used for session, preferences and security.</li>
        <li><span className="font-medium text-theme-text">Analytics (optional):</span> used to understand usage and improve the product.</li>
      </ul>
      <h2 className="text-xl font-semibold text-theme-text mb-2">Managing consent</h2>
      <p className="text-theme-text-secondary">
        You can accept or reject analytics cookies from the consent dialog shown on first visit, and you can
        reset your choice by clearing your browser storage.
      </p>
    </div>
  );
}


