import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getMongoDb } from '@/lib/mongodb'

export async function POST(req: NextRequest) {
  try {
    const adminToken = process.env.REVIEW_ADMIN_TOKEN
    const auth = req.headers.get('authorization') || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
    if (!adminToken || token !== adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, status } = await req.json()
    if (!id || !status || !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Prefer MongoDB if configured
    if (process.env.MONGODB_URI) {
      const db = await getMongoDb(process.env.MONGODB_DB || 'campusaxis0')
      const res = await db
        .collection('reviews')
        .updateOne({ _id: new (await import('mongodb')).ObjectId(id) }, { $set: { status, updated_at: new Date().toISOString() } })
      if (res.matchedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json({ ok: true })
    }

    // Supabase fallback
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) return NextResponse.json({ ok: true }) // dev fallback
    const supabase = createClient(url, serviceKey)
    const { error } = await supabase.from('reviews').update({ status }).eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unknown error' }, { status: 400 })
  }
}
