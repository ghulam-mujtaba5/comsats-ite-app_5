import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const BUCKET = process.env.SUPABASE_PAST_PAPERS_BUCKET || 'papers'
    const USE_SIGNED_URLS = String(process.env.SUPABASE_USE_SIGNED_URLS || '').toLowerCase() === 'true'

    if (!url || !serviceKey) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Supabase env vars missing',
          hint: 'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local, then restart the dev server.',
        },
        { status: 200, headers }
      )
    }

    const supabase = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Check past_papers table exists and is readable with service role
    const { count: papersCount, error: papersErr } = await supabase
      .from('past_papers')
      .select('*', { count: 'exact', head: true })

    // Check bucket existence
    const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets()
    const bucketExists = !!buckets?.find((b: any) => b.name === BUCKET)

    // If anon key is present and bucket exists, try deriving a public URL example (no file check)
    let publicAccessMode: 'public' | 'signed' | 'unknown' = 'unknown'
    if (bucketExists) {
      publicAccessMode = USE_SIGNED_URLS ? 'signed' : 'public'
    }

    const results: any = {
      ok: !papersErr && !bucketsErr && bucketExists,
      env: {
        hasUrl: !!url,
        hasServiceKey: !!serviceKey,
        hasAnonKey: !!anonKey,
      },
      bucket: {
        name: BUCKET,
        exists: bucketExists,
        storage_error: bucketsErr?.message ?? null,
        access_mode: publicAccessMode,
      },
      past_papers: {
        ok: !papersErr,
        count: typeof papersCount === 'number' ? papersCount : null,
        error: papersErr?.message ?? null,
      },
    }

    if (papersErr?.message?.includes('does not exist')) {
      results.hint = 'Run database-schema-clean.sql (or ensure past_papers table exists) in Supabase SQL editor.'
    }

    return NextResponse.json(results, { headers })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: (error as Error).message,
      },
      { status: 500, headers }
    )
  }
}
