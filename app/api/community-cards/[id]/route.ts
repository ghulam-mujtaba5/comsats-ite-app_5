import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const COOKIE_NAME = 'ite_admin'
function isAdmin(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)
  return token?.value === '1'
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = params.id
  const body = await req.json().catch(() => ({})) as Partial<{ title: string; subtitle: string | null; description: string | null; link_url: string | null; sort_order: number; status: 'draft' | 'published' }>

  const { data, error } = await supabaseAdmin
    .from('community_cards')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id,title,subtitle,description,link_url,sort_order,status,created_at,updated_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = params.id
  const { error } = await supabaseAdmin.from('community_cards').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
