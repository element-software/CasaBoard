import SidebarEditorClient from "@repo/ui/components/puck/SidebarEditorClient";
import { SupabaseServer, getCurrentAuthUser } from "@repo/lib";

export const dynamic = "force-dynamic";

export default async function SidebarCreatePage() {
  const supabase = await SupabaseServer.createClient();
  const user = await getCurrentAuthUser();
  
  let haInstances: { id: string; name: string; hass_url: string }[] = [];
  if (user) {
    const { data } = await supabase
      .from("ha_instances")
      .select("id, name, hass_url")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    haInstances = (data as any) || [];
  }

  return <SidebarEditorClient haInstances={haInstances} />;
}
