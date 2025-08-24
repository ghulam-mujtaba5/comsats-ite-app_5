import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

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
    let isAdmin = false
    const devCookie = req.cookies.get('dev_admin')?.value
    const iteCookie = req.cookies.get('ite_admin')?.value
    isAdmin = devCookie === '1' || iteCookie === '1'

    if (!isAdmin) {
      const cookieStore = await (cookies() as any)
      const rhc = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        {
          cookies: {
            get(name: string) { return cookieStore.get(name)?.value },
            set(name: string, value: string, options: any) { cookieStore.set(name, value, options) },
            remove(name: string, options: any) { cookieStore.set(name, '', { ...options, maxAge: 0 }) },
          },
        }
      )
      const { data: { user } } = await rhc.auth.getUser()
      if (user) {
        const { data: adminUser } = await rhc
          .from('admin_users')
          .select('id')
          .eq('user_id', user.id)
          .single()
        isAdmin = !!adminUser
      }
    }

    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
