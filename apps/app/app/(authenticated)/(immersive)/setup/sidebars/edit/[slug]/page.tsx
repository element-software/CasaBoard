import { SidebarActions, SupabaseServer } from "@repo/lib";
import SidebarEditorClient from "@repo/ui/components/puck/SidebarEditorClient";
import { HassConnectWrapper } from "@repo/ui/components/Shared/util/HassConnectWrapper";
import { notFound } from "next/navigation";

export const dynamicParams = true;
export const dynamic = "force-dynamic";

interface SidebarEditPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SidebarEditPage({
    params,
}: SidebarEditPageProps) {
  const { slug } = await params;
  const supabase = await SupabaseServer.createClient();

  try {
    const sidebar = await SidebarActions.getSidebar(slug);

    if (!sidebar) {
      notFound();
    }

    // Fetch all HA instances for the user
    const { data: haInstances } = await supabase
      .from("ha_instances")
      .select("id, name, hass_url")
      .eq("user_id", sidebar.user_id)
      .order("created_at", { ascending: true });

    // Get the HA instance for this sidebar (either from join or fetch separately)
    let haInstance = sidebar.ha_instance;
    if (!haInstance && sidebar.ha_instance_id) {
      const { data: instanceData } = await supabase
        .from("ha_instances")
        .select("id, name, hass_url, created_at, updated_at")
        .eq("id", sidebar.ha_instance_id)
        .single();
      
      haInstance = instanceData as unknown as typeof haInstance;
    }

    if (!haInstance) {
      console.error("HA instance not found for sidebar", sidebar.ha_instance_id);
      notFound();
    }

    return (
      <HassConnectWrapper haInstance={haInstance}>
        <SidebarEditorClient
          initialData={sidebar.puck_data}
          sidebarId={sidebar.id}
          userId={sidebar.user_id}
          initialPublished={true} // Sidebars are always "published"
          initialSlug={sidebar.slug}
          haInstances={haInstances || []}
        />
      </HassConnectWrapper>
    );
  } catch (error) {
    console.error("Error fetching sidebar:", error);
    notFound();
  }
}
