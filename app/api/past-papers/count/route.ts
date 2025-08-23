import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { mockPastPapers } from "@/lib/past-papers-data";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // Dev/mock fallback when env is missing
    if (!url || !serviceKey) {
      return NextResponse.json({ count: mockPastPapers.length })
    }

    const admin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { count, error } = await admin
      .from("past_papers")
      .select("*", { count: "exact", head: true })

    if (error) throw error

    return NextResponse.json({ count })
  } catch (error: any) {
    return NextResponse.json({ count: 0, message: error.message }, { status: 200 })
  }
}
