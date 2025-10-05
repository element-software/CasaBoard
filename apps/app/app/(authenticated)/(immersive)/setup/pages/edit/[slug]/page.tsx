import { getCurrentAuthUser, SupabaseServer } from "@repo/lib";
import PageEditorClient from "@repo/ui/components/puck/PageEditorClient";
import { HAInstanceActions } from "@repo/lib";
import { notFound } from "next/navigation";
import { HassConnectWrapper } from "@repo/ui/components/Shared/util/HassConnectWrapper";

// Enable dynamic params for unknown routes
export const dynamicParams = true;
// Force dynamic rendering since pages are stored in Supabase
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    haInstance: string;
    slug: string;
  }>;
}

export default async function PageEdit({ params }: PageProps) {
  const { haInstance, slug } = await params;
  const supabase = await SupabaseServer.createClient();

  // Get the page data
  const { data: page, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !page) {
    notFound();
  }

  // // Verify that the page belongs to the specified HA instance
  // if (page.ha_instance_id !== haInstance) {
  //   console.error("Page does not belong to the specified HA instance", page.ha_instance_id, haInstance);
  //   notFound();
  // }

  // Get the HA instance data
  const instance = await HAInstanceActions.getHAInstance(haInstance);
  console.log("edit page Instance found", instance);
  if (!instance) {
    console.error("HA instance not found", haInstance);
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
    <HassConnectWrapper haInstance={instance}>
      <PageEditorClient
        initialData={page.puck_data}
        pageId={page.id}
        initialPublished={page.published}
        haInstances={instances}
      />
    </HassConnectWrapper>
  );
}
