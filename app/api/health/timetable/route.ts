import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Supabase env vars missing',
          hint: 'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local, then restart the dev server.',
        },
        { status: 200 }
      )
    }

    const supabase = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Check timetable table exists and is readable
    const { count: timetableCount, error: timetableErr } = await supabase
      .from('timetable')
      .select('*', { count: 'exact', head: true })

    // Check timetable_docs table exists and is readable
    const { count: docsCount, error: docsErr } = await supabase
      .from('timetable_docs')
      .select('*', { count: 'exact', head: true })

    const results: any = {
      ok: !timetableErr && !docsErr,
      timetable: {
        ok: !timetableErr,
        count: typeof timetableCount === 'number' ? timetableCount : null,
        error: timetableErr?.message ?? null,
      },
      timetable_docs: {
        ok: !docsErr,
        count: typeof docsCount === 'number' ? docsCount : null,
        error: docsErr?.message ?? null,
      },
    }

    // If either table errors with "relation ... does not exist", surface a hint to apply SQL
    if (timetableErr?.message?.includes('does not exist') || docsErr?.message?.includes('does not exist')) {
      results.hint = 'Run database-schema-clean.sql in Supabase SQL editor to create required tables and policies.'
    }

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
