import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-access'

// Zod schema for a single review row (Supabase column names)
const ReviewSchema = z.object({
  id: z.string().uuid().optional(), // optional for insert; used for upsert if provided
  user_id: z.string().uuid().nullable().optional(),
  faculty_id: z.string().uuid(),
  student_name: z.string().nullable().optional(),
  course: z.string().min(1),
  semester: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  teaching_quality: z.number().int().min(1).max(5),
  accessibility: z.number().int().min(1).max(5),
  course_material: z.number().int().min(1).max(5),
  grading: z.number().int().min(1).max(5),
  comment: z.string().min(1),
  pros: z.array(z.string()).optional().default([]),
  cons: z.array(z.string()).optional().default([]),
  would_recommend: z.boolean().optional().default(false),
  is_anonymous: z.boolean().optional().default(false),
  helpful: z.number().int().nonnegative().optional().default(0),
  reported: z.number().int().nonnegative().optional().default(0),
  created_at: z.string().datetime().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
})

const PayloadSchema = z.object({
  rows: z.array(ReviewSchema).min(1),
  upsert: z.boolean().optional().default(true),
  dry_run: z.boolean().optional().default(false),
  default_status: z.enum(['pending', 'approved', 'rejected']).optional().default('approved'),
})

export async function POST(req: NextRequest) {
  const access = await requireAdmin(req)
  if (!access.allow) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Supabase env vars missing (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)' }, { status: 500 })
    }

    const body = await req.json()
    const parsed = PayloadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten() }, { status: 400 })
    }

    const { rows, upsert, dry_run, default_status } = parsed.data

    // Normalize rows: default status if missing
    const normalized = rows.map((r) => ({
      ...r,
      status: r.status ?? default_status,
      pros: r.pros ?? [],
      cons: r.cons ?? [],
      helpful: r.helpful ?? 0,
      reported: r.reported ?? 0,
    }))

    if (dry_run) {
      return NextResponse.json({ ok: true, dry_run: true, validated: normalized.length })
    }

    const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

    // Chunk to avoid payload limits
    const chunkSize = 500
    const results: Array<{ count: number } | { error: string }> = []

    for (let i = 0; i < normalized.length; i += chunkSize) {
      const chunk = normalized.slice(i, i + chunkSize)
      const query = supabase.from('reviews')
      const { data, error } = upsert
        ? await query.upsert(chunk as any, { onConflict: 'id' }).select('id')
        : await query.insert(chunk as any).select('id')
      if (error) {
        results.push({ error: `${error.message}` })
      } else {
        results.push({ count: (data as any[])?.length || 0 })
      }
    }

    const success = results.filter((r: any) => (r.count ?? 0) > 0).reduce((a: number, r: any) => a + r.count, 0)
    const failed = results.filter((r: any) => (r.error)).length

    return NextResponse.json({ ok: true, inserted_or_updated: success, chunks: results })
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unknown error' }, { status: 400 })
  }
}
