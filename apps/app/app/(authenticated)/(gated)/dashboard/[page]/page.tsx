import { DashboardPageClient } from "../DashboardPageClient";

// Enable dynamic params for unknown routes
export const dynamicParams = true;
// Force dynamic rendering since pages are stored client-side
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    page: string;
  }>;
}

export default async function ConfigurablePage({ params }: PageProps) {
  const { page } = await params;
  return <DashboardPageClient slug={page} />;
}
