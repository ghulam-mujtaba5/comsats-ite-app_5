import { NextRequest, NextResponse } from 'next/server'
import { getMongoDb } from '@/lib/mongodb'

export async function GET(_req: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        {
          ok: false,
          error: 'MONGODB_URI not set',
          hint: 'Set MONGODB_URI and MONGODB_DB in .env.local then restart the dev server.'
        },
        { status: 200, headers }
      )
    }
    const db = await getMongoDb(process.env.MONGODB_DB || 'campusaxis0')
    // ping
    const info = await db.command({ ping: 1 })
    return NextResponse.json({ ok: true, info }, { headers })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message ?? 'Unknown error' }, { status: 500, headers })
  }
}
