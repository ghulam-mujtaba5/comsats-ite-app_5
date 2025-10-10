import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800', // Cache for 1 hour, stale for 30 min
    'CDN-Cache-Control': 'public, s-maxage=3600',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=3600'
  };

  const devFallback = () =>
    NextResponse.json(
      {
        data: [
          { id: "1", question: "What is CampusAxis?", answer: "A student portal for COMSATS.", sort_order: 1 },
          { id: "2", question: "How to sign in?", answer: "Use your university email.", sort_order: 2 },
          { id: "3", question: "Is my data secure?", answer: "Yes, we use Supabase auth and RLS policies.", sort_order: 3 },
        ],
      },
      { headers: { ...headers, "X-Mock-Data": "1" } }
    )

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Dev fallback: serve a minimal FAQ list if env is missing (non-production only)
    if (process.env.NODE_ENV !== 'production' && (!url || !anon)) {
      return devFallback()
    }

    if (!url || !anon) {
      // In production with missing env, return empty data gracefully
      return NextResponse.json({ data: [] }, { headers })
    }

    const supabase = createClient(url, anon)

    // Preferred source: admin guidance table
    let mapped: Array<{ id: string; question: string; answer: string; sort_order: number }> = []
    let primaryErr: any = null
    try {
      const { data: guidance, error: gErr } = await supabase
        .from('faq_items')
        .select('id, question, answer, is_published, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (gErr) primaryErr = gErr
      if (guidance && guidance.length) {
        mapped = guidance.map((f: any, idx: number) => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
          // derive a sort order from recency (newest first)
          sort_order: idx + 1,
        }))
      }
    } catch (e) {
      primaryErr = e
    }

    // Fallback to legacy table if needed
    if (!mapped.length) {
      const { data: legacy, error: lErr } = await supabase
        .from('faqs')
        .select('id, question, answer, sort_order')
        .order('sort_order', { ascending: true })

      if (lErr) {
        const msg = (lErr as any)?.message?.toLowerCase?.() || (primaryErr?.message?.toLowerCase?.() || '')
        const missing = msg.includes('does not exist') || msg.includes('relation') || msg.includes('not found')
        if (missing && process.env.NODE_ENV !== 'production') {
          return devFallback()
        }
        return NextResponse.json({ data: [] }, { headers })
      }

      mapped = (legacy || []).map((f: any) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        sort_order: f.sort_order ?? 0,
      }))
    }

    return NextResponse.json({ data: mapped }, { headers })
  } catch {
    // Unexpected error: only mock in non-production
    if (process.env.NODE_ENV !== 'production') {
      return devFallback()
    }
    return NextResponse.json({ data: [] }, { headers })
  }
}