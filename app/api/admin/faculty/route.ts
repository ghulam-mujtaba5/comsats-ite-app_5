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

  const auth = await requireAdmin(req)
  if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
  
  const { searchParams } = new URL(req.url)
  const campusId = searchParams.get('campus_id')
  const department = searchParams.get('department')
  
  let query = supabaseAdmin
    .from('faculty')
    .select('id,name,title,department,email,office,phone,specialization,courses,education,experience,profile_image,campus_id')
    .order('name', { ascending: true })
  
  // Apply filters
  if (campusId) {
    query = query.eq('campus_id', campusId)
  }
  
  if (department) {
    query = query.eq('department', department)
  }
  
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers })
  return NextResponse.json({ data }, { headers })
}

export async function POST(req: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }
  
  const auth = await requireAdmin(req)
  if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400, headers })
  const { data, error } = await supabaseAdmin.from('faculty').insert(body).select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers })
  return NextResponse.json({ data }, { headers })
}

export async function PUT(req: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }
  
  const auth = await requireAdmin(req)
  if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
  const body = await req.json().catch(() => null)
  if (!body || !body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400, headers })
  const id = body.id
  delete body.id
  const { data, error } = await supabaseAdmin.from('faculty').update(body).eq('id', id).select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers })
  return NextResponse.json({ data }, { headers })
}

export async function DELETE(req: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }
  
  const auth = await requireAdmin(req)
  if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400, headers })
  const { error } = await supabaseAdmin.from('faculty').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers })
  return NextResponse.json({ ok: true }, { headers })
}