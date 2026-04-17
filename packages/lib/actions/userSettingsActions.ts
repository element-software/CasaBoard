"use server";

import { createClient, getCurrentAuthUser } from "../supabase/server";
import { SubscriptionService } from "../services/subscriptionService";

export async function getHaCloudSyncPreference(): Promise<boolean> {
  const supabase = await createClient();
  const user = await getCurrentAuthUser();
  if (!user) return false;

  const { data } = await supabase
    .from("user_settings")
    .select("ha_cloud_sync")
    .eq("user_id", user.id)
    .maybeSingle();

  return data?.ha_cloud_sync === true;
}

export async function setHaCloudSyncPreference(enabled: boolean): Promise<void> {
  const supabase = await createClient();
  const user = await getCurrentAuthUser();
  if (!user) throw new Error("Unauthorized");

  const entitlements =
    await SubscriptionService.getEntitlementsForCurrentUser();
  if (enabled && !entitlements.haCloudSync) {
    throw new Error(
      "Cloud sync for Home Assistant is not available on your plan."
    );
  }

  const { error } = await supabase.from("user_settings").upsert(
    {
      user_id: user.id,
      ha_cloud_sync: enabled,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) throw new Error(error.message);
}
