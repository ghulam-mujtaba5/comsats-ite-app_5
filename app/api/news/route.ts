import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'

/**
 * News API
 *
 * Required env vars (set in .env.local):
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 * - SUPABASE_SERVICE_ROLE_KEY (server-only)
 *
 * SQL — Run in Supabase SQL editor
 *
 * create extension if not exists "uuid-ossp";
 * create table if not exists news (
 *   id uuid primary key default uuid_generate_v4(),
 *   title text not null,
 *   content text not null,
 *   image_url text,
 *   status text not null default 'draft', -- 'draft' | 'published'
 *   published_at timestamptz,
 *   created_at timestamptz not null default now(),
 *   updated_at timestamptz not null default now()
 * );
 * create index if not exists ix_news_status on news(status);
 * create index if not exists ix_news_published_at on news(published_at desc);
 *
 * -- RLS (Row Level Security)
 * alter table news enable row level security;
 *
 * -- Public: read only published items
 * create policy if not exists news_public_read
 *   on news for select
 *   using (status = 'published');
 *
 * -- Disallow public writes (no insert/update/delete policies for anon)
 * -- Admin/API mutations use service role key via this API (bypasses RLS).
 */

const COOKIE_NAME = 'ite_admin'

//   updated_at timestamptz not null default now()
// );
// create index if not exists ix_news_published_at on news(published_at desc);
// create index if not exists ix_news_status on news(status);

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
  let query = supabase.from('news').select('id,title,content,image_url,status,published_at,created_at,updated_at')

  if (admin) {
    query = query.order('created_at', { ascending: false })
  } else {
    query = query.eq('status', 'published').order('published_at', { ascending: false })
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null) as { title?: string; content?: string; image_url?: string | null; status?: 'draft' | 'published'; published_at?: string | null }
  if (!body?.title || !body?.content) return NextResponse.json({ error: 'title and content are required' }, { status: 400 })

  const { title, content } = body
  const status = body.status ?? 'draft'
  const published_at = body.published_at ?? (status === 'published' ? new Date().toISOString() : null)
  const image_url = body.image_url ?? null

  const { data, error } = await supabaseAdmin
    .from('news')
    .insert({ title, content, image_url, status, published_at })
    .select('id,title,content,image_url,status,published_at,created_at,updated_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
