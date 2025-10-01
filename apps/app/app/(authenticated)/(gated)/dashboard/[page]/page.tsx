import { ClientPageWrapper } from "./ClientPageWrapper";
import { PageActions } from '@repo/lib';
import { notFound } from 'next/navigation';

// Enable dynamic params for unknown routes
export const dynamicParams = true;
// Force dynamic rendering since pages are stored in Supabase
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    page: string;
  }>;
}

export default async function ConfigurablePage({ params }: PageProps) {
  const { page } = await params;

  try {
    // Use server action to get page with proper access control
    const pageData = await PageActions.getPage(page);

    if (!pageData) {
      notFound();
    }
    
    return (
      <ClientPageWrapper 
        pageName={page}
        pageData={pageData}
        instanceId={(pageData as any)?.ha_instance_id}
      />
    );
  } catch (error) { 
    // If page not found or access denied, return 404
    notFound();
  }
}
