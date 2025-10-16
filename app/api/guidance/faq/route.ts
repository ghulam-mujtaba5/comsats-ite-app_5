import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-access'

export async function GET(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }

  try {
    // Use service role key for read operations as a temporary workaround
    // This bypasses RLS but is acceptable for published FAQ items
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let query = supabase
      .from('faq_items')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`question.ilike.%${search}%,answer.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 400, headers })
    }

    return NextResponse.json(data, { headers })
  } catch (error) {
    console.error('Internal server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

// Admin authorization centralized via requireAdmin

export async function POST(req: NextRequest) {
  try {
    // Dev fallback (non-production only): allow creating mock FAQ when Supabase env is missing
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (process.env.NODE_ENV !== 'production' && (!url || !anon)) {
      const body = await req.json()
      const {
        question = '',
        answer = '',
        category = 'academic',
        tags = [],
        is_published = true,
      } = body || {}
      const now = new Date().toISOString()
      return NextResponse.json({
        id: `mock-${Math.random().toString(36).slice(2, 9)}`,
        question,
        answer,
        category,
        tags,
        is_published,
        created_at: now,
        updated_at: now,
      }, { status: 201 })
    }
    const auth = await requireAdmin(req)
    if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const {
      question = '',
      answer = '',
      category = 'academic',
      tags = [],
      is_published = true,
    } = body || {}

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { data, error } = await supabase
      .from('faq_items')
      .insert({
        question,
        answer,
        category,
        tags,
        is_published,
      })
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}