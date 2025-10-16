import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/admin-access'

export async function GET(req: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }

  const access = await requireAdmin(req)
  if (!access.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
  const { data, error } = await supabaseAdmin
    .from('timetable')
    .select('id,course_code,course_title,section,day,start_time,end_time,room,teacher_name,department,semester,created_at')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers })
  return NextResponse.json({ data }, { headers })
}

export async function POST(req: NextRequest) {
  const access = await requireAdmin(req)
  if (!access.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const { data, error } = await supabaseAdmin.from('timetable').insert(body).select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function PUT(req: NextRequest) {
  const access = await requireAdmin(req)
  if (!access.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  if (!body || !body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const id = body.id
  delete body.id
  const { data, error } = await supabaseAdmin.from('timetable').update(body).eq('id', id).select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest) {
  const access = await requireAdmin(req)
  if (!access.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const { error } = await supabaseAdmin.from('timetable').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}