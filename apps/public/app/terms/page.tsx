const terms = [
  "Whilst under development, the service is free to use. Your free 14-day trial will simply auto-renew at no cost whilst in development.",
  "When you sign up, you agree to be contacted by us via email for updates and notifications about the service. You can opt out of these emails at any time by sending us an email to support@casaboard.dev.",
  "Attempting to purchase a subscription whilst CasaBoard is under development will result in no payment being taken, since it's all in test mode.",
  "Whilst under development, your data may be deleted at any time without notice e.g. for database updates, major table and schema changes, etc. You cannot hold us responsible for any data loss or damage or inconvenience or loss of data or any other loss or damage during this period.",
  "Since you are allowing us to store your data, specifically your Home Assistant instance data, you are agreeing to hold us harmless from any data loss or damage or inconvenience or loss of data or any other loss or damage. We will not be held responsible for any data loss, breaches, or inconsistencies with your Home Assistant instance data.",
  "Once we deem the service ready for production, the free trial will end and you will need to purchase a subscription to continue using the service. Your data may or may not be deleted at this point.",
  "When we deem the service ready for production, we will notify you via email and you will have 30 days to purchase a subscription to continue using the service. If you do not purchase a subscription within 30 days, your data will be deleted. All active users will be notified via email and you will have 30 days to purchase a subscription to continue using the service. If you do not purchase a subscription within 30 days, your data will be deleted.",
  "Once the service is ready for production, your data will be retained for as long as you have an active subscription. You can cancel your subscription at any time and your data will be deleted within 30 days.",
  "We reserve the right to change these terms at any time without notice. Any changes will be posted on this page.",
];

export default function TermsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-48">
      <h1 className="text-3xl font-bold text-theme-text mb-4">
        Terms of Service
      </h1>
      <p className="text-theme-text-secondary mb-6">
        By using CasaBoard, you agree to the following terms of service:
      </p>
      <ul className="list-disc pl-6 text-theme-text-secondary mb-6">
        {terms.map((term, index) => (
          <li key={index}>{term}</li>
        ))}
      </ul>
      <p className="text-theme-text-secondary mb-6">
        For questions, contact us at{" "}
        <a className="text-theme-primary" href="mailto:support@casaboard.dev">
          support@casaboard.dev
        </a>
        .
      </p>
    </div>
  );
}
