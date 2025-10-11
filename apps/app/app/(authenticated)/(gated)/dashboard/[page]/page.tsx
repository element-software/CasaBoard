import { ClientPageWrapper } from "./ClientPageWrapper";
import { PageActions, SupabaseServer, Encryption, getCurrentAuthUser } from '@repo/lib';
import { PuckRenderer } from "@repo/ui/components/puck/PuckRenderer";
import { HassConnectWrapper } from "@repo/ui/components/Shared/util/HassConnectWrapper";
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
    // Resolve per-page HA instance on the server
    if ((pageData as any)?.ha_instance_id) {
      const supabase = await SupabaseServer.createClient();
      const user = await getCurrentAuthUser();
      if (user) {
        const { data: instance } = await supabase
          .from('ha_instances')
          .select('hass_url,hass_token')
          .eq('id', (pageData as any).ha_instance_id)
          .single();
        if (instance) {
          let token: string | null = instance.hass_token;
          try {
            token = await Encryption.decryptToken(
              instance.hass_token,
              user.id,
              Encryption.generateSessionId(user.id, user.email)
            );
          } catch {}
        }
      }
    }
    if (!pageData.ha_instance) {
      notFound();
    }

    return (
      <HassConnectWrapper haInstance={pageData.ha_instance}>
      <PuckRenderer pageId={page} pageData={pageData}/>
      </HassConnectWrapper>
    );
  } catch (error) { 
    // If page not found or access denied, return 404
    notFound();
  }
}