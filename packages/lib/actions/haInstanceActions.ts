"use server";

import { createClient, getCurrentAuthUser } from "../supabase/server";
import { SubscriptionService } from "../services/subscriptionService";
import { getHaCloudSyncPreference } from "./userSettingsActions";

export interface CreateHAInstanceInput {
  name: string;
  hass_url: string;
}

export type UpdateHAInstanceInput = Partial<
  Pick<CreateHAInstanceInput, "name" | "hass_url">
> & {
  id: string;
};

async function canAccessCloudMetadata(): Promise<boolean> {
  const entitlements =
    await SubscriptionService.getEntitlementsForCurrentUser();
  if (!entitlements.haCloudSync) return false;
  return getHaCloudSyncPreference();
}

export async function listHAInstances() {
  const supabase = await createClient();
  const user = await getCurrentAuthUser();
  if (!user) throw new Error("Unauthorized");

  if (!(await canAccessCloudMetadata())) {
    return [];
  }

  const { data, error } = await supabase
    .from("ha_instances")
    .select("id,name,hass_url,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createHAInstance(input: CreateHAInstanceInput) {
  if (!(await canAccessCloudMetadata())) {
    throw new Error(
      "Enable cloud sync (paid plans) to store Home Assistant URLs on the server, or add instances locally."
    );
  }

  const supabase = await createClient();
  const user = await getCurrentAuthUser();
  if (!user) throw new Error("Unauthorized");

  const { count } = await supabase
    .from("ha_instances")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const entitlements =
    await SubscriptionService.getEntitlementsForCurrentUser();
  if (
    entitlements.active &&
    entitlements.maxHAInstances >= 0 &&
    (count ?? 0) >= entitlements.maxHAInstances
  ) {
    throw new Error("HA instances limit reached for your plan");
  }

  const { data, error } = await supabase
    .from("ha_instances")
    .insert({
      user_id: user.id,
      name: input.name,
      hass_url: input.hass_url,
    })
    .select("id,name,hass_url,created_at")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteHAInstance(id?: string) {
  if (!(await canAccessCloudMetadata())) {
    throw new Error("Cloud sync is not enabled.");
  }

  const supabase = await createClient();
  const user = await getCurrentAuthUser();
  if (!user) throw new Error("Unauthorized");

  if (!id) {
    const { error: deleteErr } = await supabase
      .from("ha_instances")
      .delete()
      .eq("user_id", user.id);
    if (deleteErr) throw new Error(deleteErr.message);
    return { success: true };
  }

  const { error } = await supabase
    .from("ha_instances")
    .delete()
    .eq("user_id", user.id)
    .eq("id", id);
  if (error) throw new Error(error.message);

  return { success: true };
}

export async function getFirstHAInstance() {
  const rows = await listHAInstances();
  return rows[0] ?? null;
}

export async function getHAInstance(id: string) {
  const supabase = await createClient();
  const user = await getCurrentAuthUser();
  if (!user) throw new Error("Unauthorized");

  if (!(await canAccessCloudMetadata())) {
    return null;
  }

  const { data, error } = await supabase
    .from("ha_instances")
    .select("id,name,hass_url,created_at")
    .eq("user_id", user.id)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateHAInstance(data: UpdateHAInstanceInput) {
  if (!(await canAccessCloudMetadata())) {
    throw new Error("Cloud sync is not enabled.");
  }

  const supabase = await createClient();
  const user = await getCurrentAuthUser();
  if (!user) throw new Error("Unauthorized");

  const { id, ...patch } = data;
  const { error } = await supabase
    .from("ha_instances")
    .update(patch)
    .eq("user_id", user.id)
    .eq("id", id);
  if (error) throw new Error(error.message);
  return data;
}
