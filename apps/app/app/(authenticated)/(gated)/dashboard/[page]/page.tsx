import {
  PageActions,
  SupabaseServer,
  Encryption,
  getCurrentAuthUser,
} from "@repo/lib";
import { PuckRenderer } from "@repo/ui/components/puck/PuckRenderer";
import { HassConnectWrapper } from "@repo/ui/components/Shared/util/HassConnectWrapper";
import { notFound } from "next/navigation";

// Enable dynamic params for unknown routes
export const dynamicParams = true;
// Force dynamic rendering since pages are stored in Supabase
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    page: string;
  }>;
}

export default async function ConfigurablePage({ params }: PageProps) {
  const { page } = await params;

  try {
    // Use getPageBySlug to allow access to published pages
    const pageData = await PageActions.getPageBySlug(page);

    if (!pageData || !pageData.ha_instance) {
      notFound();
    }

    return (
      <HassConnectWrapper haInstance={pageData.ha_instance}>
        <PuckRenderer pageId={page} pageData={pageData} />
      </HassConnectWrapper>
    );
  } catch (error) {
    console.error("Error fetching page:", error);
    // If page not found or access denied, return 404
    notFound();
  }
}
