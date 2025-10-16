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

  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'pending'
    const limit = Number(searchParams.get('limit') || '50')

    let query = supabaseAdmin.from('past_papers').select('*').order('created_at', { ascending: false }).limit(limit)
    if (status) {
      query = query.eq('status', status)
    }
    const { data, error } = await query
    if (error) throw error
    return NextResponse.json({ data }, { headers })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to fetch past papers' }, { status: 400, headers })
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const id = body?.id as string
    const status = body?.status as string | undefined

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    if (status) {
      const { data, error } = await supabaseAdmin
        .from('past_papers')
        .update({ status })
        .eq('id', id)
        .select('*')
        .maybeSingle()
      if (error) throw error
      return NextResponse.json({ data })
    }

    return NextResponse.json({ error: 'Nothing to do' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to update past paper' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const { error } = await supabaseAdmin.from('past_papers').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to delete past paper' }, { status: 400 })
  }
}