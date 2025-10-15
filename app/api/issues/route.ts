import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireAdmin } from "@/lib/admin-access"
import { notifyNewIssue } from "@/lib/notification-helpers"

// POST /api/issues  -> public: create a new issue report
// GET  /api/issues  -> admin: list issue reports

export async function POST(req: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }
  
  try {
    const body = await req.json()
    const title = String(body?.title || "").trim()
    const description = String(body?.description || "").trim()
    const category = String(body?.category || "General").trim()
    const email = body?.email ? String(body.email).trim() : null

    if (!title) return NextResponse.json({ error: "Missing field: title" }, { status: 400, headers })
    if (!description) return NextResponse.json({ error: "Missing field: description" }, { status: 400, headers })

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
      return NextResponse.json({ message: "Issue submitted (dev mode)", issue: doc }, { status: 200, headers })
    }

    const supabase = createClient(url, serviceKey)
    const { data, error } = await supabase
      .from("issue_reports")
      .insert([{ title, description, category, email, status: "open" }])
      .select()

    if (error) return NextResponse.json({ error: "Failed to submit issue" }, { status: 500, headers })
    
    // Send notification to admins about the new issue
    if (data && data[0]) {
      await notifyNewIssue(data[0].id, data[0].title, data[0].email || undefined)
    }
    
    return NextResponse.json({ message: "Issue submitted", issue: data?.[0] }, { status: 200, headers })
  } catch (e) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500, headers })
  }
}

export async function GET(req: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

  // Admin only
  try {
    const auth = await requireAdmin(req)
    if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
      return NextResponse.json({ issues: [] }, { status: 200, headers })
    }

    const supabase = createClient(url, serviceKey)
    const { data, error } = await supabase
      .from("issue_reports")
      .select("id, title, description, category, email, status, created_at")
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500, headers })

    return NextResponse.json({ issues: data || [] }, { status: 200, headers })
  } catch (e) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500, headers })
  }
}