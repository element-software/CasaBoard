"use server";
import { createClient } from "../supabase/server";
import { SubscriptionService } from "../services/subscriptionService";

export interface CreateHAInstanceInput {
  name: string;
  hass_url: string;
  hass_token: string; // encrypted upstream
}

export async function listHAInstances() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data, error } = await supabase
    .from("ha_instances")
    .select("id,name,hass_url,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createHAInstance(input: CreateHAInstanceInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { count } = await supabase
    .from("ha_instances")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const entitlements = await SubscriptionService.getEntitlementsForCurrentUser();
  if (entitlements.active && entitlements.maxHAInstances >= 0 && (count ?? 0) >= entitlements.maxHAInstances) {
    throw new Error("HA instances limit reached for your plan");
  }

  const { data, error } = await supabase
    .from("ha_instances")
    .insert({
      user_id: user.id,
      name: input.name,
      hass_url: input.hass_url,
      hass_token: input.hass_token,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  // If this is the first and only instance, make it the active/default
  if ((count ?? 0) === 0 && data?.id) {
    const instance = { hass_url: data.hass_url, hass_token: data.hass_token } as { hass_url: string; hass_token: string };
    const { data: existing } = await supabase
      .from("user_settings")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existing) {
      const { error: upErr } = await supabase
        .from("user_settings")
        .update({ hass_url: instance.hass_url, hass_token: instance.hass_token, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);
      if (upErr) throw new Error(upErr.message);
    } else {
      const { error: insErr } = await supabase
        .from("user_settings")
        .insert({ user_id: user.id, hass_url: instance.hass_url, hass_token: instance.hass_token });
      if (insErr) throw new Error(insErr.message);
    }
  }
  return data;
}

export async function deleteHAInstance(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { error } = await supabase
    .from("ha_instances")
    .delete()
    .eq("user_id", user.id)
    .eq("id", id);
  if (error) throw new Error(error.message);

  // After deletion, ensure default selection rules
  const { data: remaining, error: remErr } = await supabase
    .from("ha_instances")
    .select("id,hass_url,hass_token")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });
  if (remErr) throw new Error(remErr.message);

  if (!remaining || remaining.length === 0) {
    // Clear user_settings if no instances remain
    const { error: clearErr } = await supabase
      .from("user_settings")
      .update({ hass_url: null, hass_token: null, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);
    if (clearErr) throw new Error(clearErr.message);
  } else if (remaining.length === 1) {
    // If exactly one remains, make it the default
    const only = remaining[0]!;
    const { data: existing } = await supabase
      .from("user_settings")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existing) {
      const { error: upErr } = await supabase
        .from("user_settings")
        .update({ hass_url: only.hass_url, hass_token: only.hass_token, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);
      if (upErr) throw new Error(upErr.message);
    } else {
      const { error: insErr } = await supabase
        .from("user_settings")
        .insert({ user_id: user.id, hass_url: only.hass_url, hass_token: only.hass_token });
      if (insErr) throw new Error(insErr.message);
    }
  }
  return { success: true };
}

export async function setActiveHAInstance(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: instance, error: fetchError } = await supabase
    .from("ha_instances")
    .select("hass_url,hass_token,user_id")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);
  if (!instance || instance.user_id !== user.id) throw new Error("Not found");

  // Upsert into user_settings so the rest of the app uses the selected instance
  const { data: existing } = await supabase
    .from("user_settings")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("user_settings")
      .update({ hass_url: instance.hass_url, hass_token: instance.hass_token, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("user_settings")
      .insert({ user_id: user.id, hass_url: instance.hass_url, hass_token: instance.hass_token });
    if (error) throw new Error(error.message);
  }

  return { success: true };
}


