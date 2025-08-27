import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-access'

// Zod schema for a single faculty row
const FacultySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  department: z.string().min(1),
  title: z.string().optional().default(''),
  email: z.string().email().nullable().optional(),
  office: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  specialization: z.array(z.string()).optional().default([]),
  courses: z.array(z.string()).optional().default([]),
  education: z.array(z.string()).optional().default([]),
  experience: z.string().optional().default(''),
  profile_image: z.string().url().nullable().optional(),
  created_at: z.string().datetime().optional(),
})

const PayloadSchema = z.object({
  rows: z.array(FacultySchema).min(1),
  upsert: z.boolean().optional().default(true),
  dry_run: z.boolean().optional().default(false),
  // If true, missing optional array fields will be defaulted to []
  fill_defaults: z.boolean().optional().default(true),
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

    const { rows, upsert, dry_run, fill_defaults } = parsed.data

    // Validate and normalize
    const normalized = rows.map((r) => ({
      ...r,
      specialization: fill_defaults ? (r.specialization ?? []) : r.specialization,
      courses: fill_defaults ? (r.courses ?? []) : r.courses,
      education: fill_defaults ? (r.education ?? []) : r.education,
    }))

    if (dry_run) {
      return NextResponse.json({ ok: true, dry_run: true, validated: normalized.length })
    }

    const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

    // Chunk inserts to avoid payload limits
    const chunkSize = 500
    const results: Array<{ count: number } | { error: string }> = []

    for (let i = 0; i < normalized.length; i += chunkSize) {
      const chunk = normalized.slice(i, i + chunkSize)
      const query = supabase.from('faculty')
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
