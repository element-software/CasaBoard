import { getCurrentAuthUser, SupabaseServer } from "@repo/lib";
import PageEditorClient from "@repo/ui/components/puck/PageEditorClient";
import { HassConnectWrapper } from "@repo/ui/components/Shared/util/HassConnectWrapper";
import { notFound } from "next/navigation";

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
  const { data: page, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();

  const { data: instances } = await supabase
    .from("ha_instances")
    .select("id,name,hass_url")
    .eq("user_id", page.user_id)
    .order("created_at", { ascending: true });

  if (error || !page || !instances) {
    notFound();
  }

  return (
    <HassConnectWrapper instanceId={page.ha_instance_id}>
      <PageEditorClient
        initialData={page.puck_data}
        pageId={page.id}
        initialPublished={page.published}
        haInstances={instances}
      />
    </HassConnectWrapper>
  );
}
