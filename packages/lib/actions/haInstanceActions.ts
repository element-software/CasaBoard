"use server";
import { createClient, getCurrentAuthUser } from "../supabase/server";
import { SubscriptionService } from "../services/subscriptionService";

export interface CreateHAInstanceInput {
  name: string;
  hass_url: string;
  hass_token?: string | null;
  ha_refresh_token?: string | null;
  expires_at?: string | null;
}

export type UpdateHAInstanceInput = Partial<CreateHAInstanceInput> & {
  id: string;
};

export async function listHAInstances() {
  const supabase = await createClient();
  const user = await getCurrentAuthUser();
  if (!user) throw new Error("Unauthorized");
  const { data, error } = await supabase
    .from("ha_instances")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createHAInstance(input: CreateHAInstanceInput) {
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
      hass_token: input.hass_token ?? null,
      ha_refresh_token: input.ha_refresh_token ?? null,
      expires_at: input.expires_at ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  // No longer syncing to user_settings
  return data;
}

export async function deleteHAInstance(id?: string) {
  const supabase = await createClient();
  const user = await getCurrentAuthUser();
  if (!user) throw new Error("Unauthorized");
  if (!id) {
    // Delete first instance
    const { error: deleteErr } = await supabase
      .from("ha_instances")
      .delete()
      .eq("user_id", user.id);
    if (deleteErr) throw new Error(deleteErr.message);
    return { success: true };
  } else {
    const { error } = await supabase
      .from("ha_instances")
      .delete()
      .eq("user_id", user.id)
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  // After deletion, nothing else to do (active selection removed)
  return { success: true };
}

export async function getFirstHAInstance() {
  const supabase = await createClient();
  const user = await getCurrentAuthUser();
  if (!user) throw new Error("Unauthorized");
  const { data, error } = await supabase
    .from("ha_instances")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateHAInstance(data: UpdateHAInstanceInput) {
  const supabase = await createClient();
  const user = await getCurrentAuthUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("ha_instances")
    .update(data)
    .eq("user_id", user.id)
    .eq("id", data.id);
  if (error) throw new Error(error.message);
  return data;
}

export async function getLongLivedTokenForHAInstance(id: string) {
  const supabase = await createClient();
  const user = await getCurrentAuthUser();
  if (!user) throw new Error("Unauthorized");
  const { data, error } = await supabase
    .from("ha_instances")
    .select("hass_url,hass_token")
    .eq("user_id", user.id)
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  // Exchange short-lived token for a long-lived token via REST
  const response = await fetch(
    `${data.hass_url}/auth/long_lived_access_token`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${data.hass_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Name visible in HA UI; can be 'My App'
        client_name: "My App",
        // Expiry in days (e.g., 365 for 1 year)
        lifespan: 365,
      }),
    }
  );

  if (!response.ok) throw new Error("Failed to create long-lived token");
  const longLivedTokenData = await response.json();

  // Update the instance with the new long-lived token
  const { error: updateErr } = await supabase
    .from("ha_instances")
    .update({ hass_token: longLivedTokenData.token })
    .eq("user_id", user.id)
    .eq("id", id);
  if (updateErr) throw new Error(updateErr.message);
  return longLivedTokenData.token;
}
