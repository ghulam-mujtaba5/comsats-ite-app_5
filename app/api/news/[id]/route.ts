import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@supabase/supabase-js'

const COOKIE_NAME = 'ite_admin'
function isAdmin(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)
  return token?.value === '1'
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return NextResponse.json({ error: 'Supabase env missing' }, { status: 500 })
  const supabase = createClient(url, anon)

  const admin = isAdmin(req)
  let query = supabase.from('news').select('id,title,content,image_url,status,published_at,created_at,updated_at').eq('id', id).single()
  if (!admin) {
    // ensure only published for public
    query = supabase.from('news').select('id,title,content,image_url,status,published_at,created_at,updated_at').eq('id', id).eq('status', 'published').single()
  }
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ data })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = params.id
  const body = await req.json().catch(() => ({})) as Partial<{ title: string; content: string; status: 'draft' | 'published'; published_at: string | null }>

  // If status is switching to published and no published_at provided, set now
  if (body.status === 'published' && !body.published_at) {
    body.published_at = new Date().toISOString()
  }

  const { data, error } = await supabaseAdmin
    .from('news')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id,title,content,image_url,status,published_at,created_at,updated_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = params.id
  const { error } = await supabaseAdmin.from('news').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
