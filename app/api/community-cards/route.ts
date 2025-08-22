import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'

/**
 * Community Cards API
 *
 * Required env vars (set in .env.local):
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 * - SUPABASE_SERVICE_ROLE_KEY (server-only)
 *
 * SQL — Run in Supabase SQL editor
 *
 * create extension if not exists "uuid-ossp";
 * create table if not exists community_cards (
 *   id uuid primary key default uuid_generate_v4(),
 *   title text not null,
 *   subtitle text,
 *   description text,
 *   link_url text,
 *   sort_order int not null default 0,
 *   status text not null default 'published', -- 'draft' | 'published'
 *   created_at timestamptz not null default now(),
 *   updated_at timestamptz not null default now()
 * );
 * create index if not exists ix_community_cards_sort on community_cards(sort_order asc);
 * create index if not exists ix_community_cards_status on community_cards(status);
 *
 * -- RLS (Row Level Security)
 * alter table community_cards enable row level security;
 *
 * -- Public: read only published items
 * create policy if not exists community_cards_public_read
 *   on community_cards for select
 *   using (status = 'published');
 *
 * -- Disallow public writes; admin/API mutations use service role key via this API (bypasses RLS).
 */

const COOKIE_NAME = 'ite_admin'

// SQL (run in Supabase SQL editor):
// create extension if not exists "uuid-ossp";
// create table if not exists community_cards (
//   id uuid primary key default uuid_generate_v4(),
//   title text not null,
//   subtitle text,
//   description text,
//   link_url text,
//   sort_order int not null default 0,
//   status text not null default 'published', -- 'draft' | 'published'
//   created_at timestamptz not null default now(),
//   updated_at timestamptz not null default now()
// );
// create index if not exists ix_community_cards_sort on community_cards(sort_order asc);
// create index if not exists ix_community_cards_status on community_cards(status);

function isAdmin(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)
  return token?.value === '1'
}

export async function GET(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return NextResponse.json({ error: 'Supabase env missing' }, { status: 500 })
  const supabase = createClient(url, anon)

  const admin = isAdmin(req)
  let query = supabase.from('community_cards').select('id,title,subtitle,description,link_url,sort_order,status,created_at,updated_at')
  if (!admin) {
    query = query.eq('status', 'published').order('sort_order', { ascending: true })
  } else {
    query = query.order('sort_order', { ascending: true }).order('created_at', { ascending: false })
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null) as { title?: string; subtitle?: string | null; description?: string | null; link_url?: string | null; sort_order?: number; status?: 'draft' | 'published' }
  if (!body?.title) return NextResponse.json({ error: 'title is required' }, { status: 400 })

  const { title, subtitle = null, description = null, link_url = null } = body
  const sort_order = body.sort_order ?? 0
  const status = body.status ?? 'published'

  const { data, error } = await supabaseAdmin
    .from('community_cards')
    .insert({ title, subtitle, description, link_url, sort_order, status })
    .select('id,title,subtitle,description,link_url,sort_order,status,created_at,updated_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
