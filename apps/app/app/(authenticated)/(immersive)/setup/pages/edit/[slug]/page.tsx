import { PageActions, SupabaseServer } from "@repo/lib";
import PageEditorClient from "@repo/ui/components/puck/PageEditorClient"
import { notFound } from "next/navigation";
import { HassConnectWrapper } from "@repo/ui/components/Shared/util/HassConnectWrapper";

// Enable dynamic params for unknown routes
export const dynamicParams = true;
// Force dynamic rendering since pages are stored in Supabase
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PageEdit({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await SupabaseServer.createClient();

  // Get the page data
  const page = await PageActions.getPage(slug);
  console.log("edit page", "page", page);
  if (!page) {
    notFound();
  }

  // Get the HA instance data - if not populated by the join, fetch it separately
  let haInstance = page.ha_instance;
  if (!haInstance && page.ha_instance_id) {
    const { data: instanceData } = await supabase
      .from("ha_instances")
      .select("id, name, hass_url, created_at, updated_at")
      .eq("id", page.ha_instance_id)
      .single();
    
    haInstance = instanceData;
  }
  
  console.log("edit page Instance found", haInstance);
  if (!haInstance) {
    console.error("HA instance not found", page.ha_instance_id);
    notFound();
  }

  const { data: instances } = await supabase
    .from("ha_instances")
    .select("id,name,hass_url")
    .eq("user_id", page.user_id)
    .order("created_at", { ascending: true });

  if (!instances) {
    console.error("Instances not found", instances);
    notFound();
  }

  return (
    <HassConnectWrapper haInstance={haInstance}>
      <PageEditorClient
        initialData={page.puck_data}
        pageId={page.id}
        initialPublished={page.published}
        haInstances={instances}
      />
    </HassConnectWrapper>
  );
}
