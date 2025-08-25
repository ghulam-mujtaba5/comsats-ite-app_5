import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireAdmin } from "@/lib/admin-access"

// POST /api/issues  -> public: create a new issue report
// GET  /api/issues  -> admin: list issue reports

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const title = String(body?.title || "").trim()
    const description = String(body?.description || "").trim()
    const category = String(body?.category || "General").trim()
    const email = body?.email ? String(body.email).trim() : null

    if (!title) return NextResponse.json({ error: "Missing field: title" }, { status: 400 })
    if (!description) return NextResponse.json({ error: "Missing field: description" }, { status: 400 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
      // Dev fallback: accept and return mock
      const doc = {
        id: `mock-${Date.now()}`,
        title,
        description,
        category,
        email,
        status: "open",
        created_at: new Date().toISOString(),
      }
      return NextResponse.json({ message: "Issue submitted (dev mode)", issue: doc }, { status: 200 })
    }

    const supabase = createClient(url, serviceKey)
    const { data, error } = await supabase
      .from("issue_reports")
      .insert([{ title, description, category, email, status: "open" }])
      .select()

    if (error) return NextResponse.json({ error: "Failed to submit issue" }, { status: 500 })
    return NextResponse.json({ message: "Issue submitted", issue: data?.[0] }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  // Admin only
  try {
    const auth = await requireAdmin(req)
    if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
      return NextResponse.json({ issues: [] }, { status: 200 })
    }

    const supabase = createClient(url, serviceKey)
    const { data, error } = await supabase
      .from("issue_reports")
      .select("id, title, description, category, email, status, created_at")
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 })

    return NextResponse.json({ issues: data || [] }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
