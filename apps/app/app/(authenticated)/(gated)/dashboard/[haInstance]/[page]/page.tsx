import { ClientPageWrapper } from "./ClientPageWrapper";
import { PageActions, PageActions } from '@repo/lib';
import { notFound } from 'next/navigation';

// Enable dynamic params for unknown routes
export const dynamicParams = true;
// Force dynamic rendering since pages are stored in Supabase
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    haInstance: string;
    page: string;
  }>;
}

export default async function ConfigurablePage({ params }: PageProps) {
  const { haInstance, page } = await params;

  try {
    // Use server action to get page with proper access control
    const pageData = await PageActions.getPage(page);

    if (!pageData) {
      notFound();
    }
    
    // Verify that the page belongs to the specified HA instance
    if ((pageData as any)?.ha_instance_id !== haInstance) {
      notFound();
    }
    
    return (
      <ClientPageWrapper 
        pageName={page}
        pageData={pageData}
      />
    );
  } catch (error) { 
    // If page not found or access denied, return 404
    notFound();
  }
}
