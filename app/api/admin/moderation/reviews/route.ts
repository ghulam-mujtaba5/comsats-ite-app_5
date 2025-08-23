import { NextRequest, NextResponse } from 'next/server'
import { getMongoDb } from '@/lib/mongodb'
import { supabaseAdmin } from '@/lib/supabase-admin'

const COOKIE_NAME = 'ite_admin'

function assertAdmin(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)
  if (token?.value !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

export async function GET(req: NextRequest) {
  const unauthorized = assertAdmin(req)
  if (unauthorized) return unauthorized

  try {
    const { searchParams } = new URL(req.url)
    const status = (searchParams.get('status') || 'pending').toLowerCase()
    const allowed = ['pending', 'approved', 'rejected']
    const statusFilter = allowed.includes(status) ? status : 'pending'
    // Prefer MongoDB if configured
    if (process.env.MONGODB_URI) {
      const db = await getMongoDb(process.env.MONGODB_DB || 'campusaxis0')
      const docs = await db
        .collection('reviews')
        .find({ status: statusFilter })
        .sort({ created_at: -1 })
        .limit(200)
        .toArray()
      const data = docs.map((row: any) => ({ ...row, id: String(row._id) }))
      return NextResponse.json({ data })
    }

    // Supabase fallback
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('status', statusFilter)
      .order('created_at', { ascending: false })
      .limit(200)
    if (error) throw error
    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unknown error' }, { status: 400 })
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = assertAdmin(req)
  if (unauthorized) return unauthorized

  try {
    const { id, status } = await req.json()
    if (!id || !status || !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    if (process.env.MONGODB_URI) {
      const db = await getMongoDb(process.env.MONGODB_DB || 'campusaxis0')
      const res = await db
        .collection('reviews')
        .updateOne({ _id: new (await import('mongodb')).ObjectId(id) }, { $set: { status, updated_at: new Date().toISOString() } })
      if (res.matchedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json({ ok: true })
    }

    const { error } = await supabaseAdmin.from('reviews').update({ status }).eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unknown error' }, { status: 400 })
  }
}
