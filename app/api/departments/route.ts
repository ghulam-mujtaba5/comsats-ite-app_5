import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=450', // Cache for 15 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=900',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=900'
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  const { searchParams } = new URL(request.url)
  const campusId = searchParams.get('campus_id')

  try {
    let query = supabase
      .from('departments')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (campusId) {
      query = query.eq('campus_id', campusId)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400, headers })
    }

    return NextResponse.json(data || [], { headers })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}