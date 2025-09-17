import { getCurrentAuthUser, SupabaseClient } from '@repo/lib'
import { NextRequest, NextResponse } from 'next/server'
import { CreatePageData } from '@repo/types/page'

export async function GET() {
  const supabase = await SupabaseClient.createClient()
  
  const user = await getCurrentAuthUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: pages, error } = await supabase
    .from('pages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(pages)
}

export async function POST(request: NextRequest) {
  const supabase = await SupabaseClient.createClient()
  
  const user = await getCurrentAuthUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: CreatePageData = await request.json()

  // Check if slug already exists for this user
  const { data: existingPage } = await supabase
    .from('pages')
    .select('id')
    .eq('user_id', user.id)
    .eq('slug', body.slug)
    .single()

  if (existingPage) {
    return NextResponse.json(
      { error: 'A page with this slug already exists' },
      { status: 400 }
    )
  }

  const { data: page, error } = await supabase
    .from('pages')
    .insert({
      name: body.name,
      slug: body.slug,
      puck_data: body.puck_data,
      published: body.published ?? false,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(page, { status: 201 })
}
