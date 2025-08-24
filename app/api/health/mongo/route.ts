import { NextRequest, NextResponse } from 'next/server'
import { getMongoDb } from '@/lib/mongodb'

export async function GET(_req: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        {
          ok: false,
          error: 'MONGODB_URI not set',
          hint: 'Set MONGODB_URI and MONGODB_DB in .env.local then restart the dev server.'
        },
        { status: 200 }
      )
    }
    const db = await getMongoDb(process.env.MONGODB_DB || 'campusaxis0')
    // ping
    const info = await db.command({ ping: 1 })
    return NextResponse.json({ ok: true, info })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message ?? 'Unknown error' }, { status: 500 })
  }
}
