import PageEditorClient from "@repo/ui/components/puck/PageEditorClient";
import { SupabaseServer, getCurrentAuthUser } from "@repo/lib";

// Enable dynamic params for unknown routes
export const dynamicParams = true;
// Force dynamic rendering since pages are stored in Supabase
export const dynamic = 'force-dynamic';

export default async function PageCreate() {
  // Fetch HA instances for the current user on the server
  const supabase = await SupabaseServer.createClient();
  const user = await getCurrentAuthUser();
  let instances: { id: string; name: string; hass_url: string }[] = [];
  if (user) {
    const { data } = await supabase
      .from("ha_instances")
      .select("id,name,hass_url")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    instances = (data as any) || [];
  }
  return <PageEditorClient haInstances={instances} />;
}
