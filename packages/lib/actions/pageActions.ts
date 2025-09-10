"use server";

import { createClient } from '../supabase/server';
import { CreatePageData, UpdatePageData } from '@repo/types/page';
import { revalidatePath } from 'next/cache';

export async function createPage(data: CreatePageData) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    // Check if slug already exists for this user
    const { data: existingPage } = await supabase
      .from('pages')
      .select('id')
      .eq('user_id', user.id)
      .eq('slug', data.slug)
      .single();

    if (existingPage) {
      throw new Error('A page with this slug already exists');
    }

    const { data: page, error } = await supabase
      .from('pages')
      .insert({
        name: data.name,
        slug: data.slug,
        puck_data: data.puck_data,
        published: data.published ?? false,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/setup/pages');
    return page;
  } catch (error) {
    console.error('Failed to create page:', error);
    throw error;
  }
}

export async function updatePage(slug: string, data: UpdatePageData) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { data: page, error } = await supabase
      .from('pages')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Page not found');
      }
      throw new Error(error.message);
    }

    revalidatePath('/setup/pages');
    revalidatePath(`/${slug}`);
    return page;
  } catch (error) {
    console.error('Failed to update page:', error);
    throw error;
  }
}

export async function deletePage(slug: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('user_id', user.id)
      .eq('slug', slug);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/setup/pages');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete page:', error);
    throw error;
  }
}

export async function getPage(slug: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { data: page, error } = await supabase
      .from('pages')
      .select('*')
      .eq('user_id', user.id)
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Page not found');
      }
      throw new Error(error.message);
    }

    return page;
  } catch (error) {
    console.error('Failed to get page:', error);
    throw error;
  }
}

export async function getAllPages() {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { data: pages, error } = await supabase
      .from('pages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return pages;
  } catch (error) {
    console.error('Failed to get all pages:', error);
    throw error;
  }
}

export async function getPageBySlug(slug: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();


    // First, try to get the page
    const { data: page, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Page not found');
      }
      throw new Error(error.message);
    }

    // Check access permissions
    const isPublished = page.published;
    const isOwner = user && page.user_id === user.id;

    // Allow access if page is published OR user is the owner
    if (!isPublished && !isOwner) {
      throw new Error('Page not found');
    }

    return page;
  } catch (error) {
    console.error('Failed to get page by slug:', error);
    throw error;
  }
}
