"use server";

import { createClient } from '../supabase/server';
import { CreateUserSettingsData, UpdateUserSettingsData, UserSettings } from '@repo/types/userSettings';
import { revalidatePath } from 'next/cache';

export async function getUserSettings(): Promise<UserSettings | null> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { data: settings, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No settings found
      }
      throw new Error(error.message);
    }

    return settings;
  } catch (error) {
    console.warn('Failed to get user settings:', error);
    return null;
  }
}

export async function createUserSettings(data: CreateUserSettingsData): Promise<UserSettings> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { data: settings, error } = await supabase
      .from('user_settings')
      .insert({
        user_id: user.id,
        hass_url: data.hass_url,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/setup');
    return settings;
  } catch (error) {
    console.error('Failed to create user settings:', error);
    throw error;
  }
}

export async function updateUserSettings(data: UpdateUserSettingsData): Promise<UserSettings> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    // First check if settings exist
    const { data: existingSettings } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let settings, error;

    if (existingSettings) {
      // Update existing settings
      const result = await supabase
        .from('user_settings')
        .update({
          hass_url: data.hass_url,
          hass_token: data.hass_token,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();
      
      settings = result.data;
      error = result.error;
    } else {
      // Create new settings
      const result = await supabase
        .from('user_settings')
        .insert({
          user_id: user.id,
          hass_url: data.hass_url,
          hass_token: data.hass_token,
        })
        .select()
        .single();
      
      settings = result.data;
      error = result.error;
    }

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/setup');
    return settings;
  } catch (error) {
    console.error('Failed to update user settings:', error);
    throw error;
  }
}

export async function deleteUserSettings(): Promise<void> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { error } = await supabase
      .from('user_settings')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/setup');
  } catch (error) {
    console.error('Failed to delete user settings:', error);
    throw error;
  }
}
