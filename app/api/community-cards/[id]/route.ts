import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/admin-access'

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

  const { id } = await context.params
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return NextResponse.json({ error: 'Supabase env missing' }, { status: 500, headers })
  const supabase = createClient(url, anon)

  const { data, error } = await supabase
    .from('community_cards')
    .select('id,title,subtitle,description,link_url,sort_order,status,created_at,updated_at')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404, headers })
  return NextResponse.json({ data }, { headers })
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }
  
  const auth = await requireAdmin(req)
  if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
  const { id } = await context.params
  const body = await req.json().catch(() => ({})) as Partial<{ title: string; subtitle: string | null; description: string | null; link_url: string | null; sort_order: number; status: 'draft' | 'published' }>

  const { data, error } = await supabaseAdmin
    .from('community_cards')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id,title,subtitle,description,link_url,sort_order,status,created_at,updated_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers })
  return NextResponse.json({ data }, { headers })
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }
  
  const auth = await requireAdmin(req)
  if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
  const { id } = await context.params
  const { error } = await supabaseAdmin.from('community_cards').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers })
  return NextResponse.json({ ok: true }, { headers })
}