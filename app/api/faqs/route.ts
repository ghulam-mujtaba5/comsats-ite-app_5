import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Dev fallback: serve a minimal FAQ list if env is missing
    if (!url || !anon) {
      return NextResponse.json({
        data: [
          { id: "1", question: "What is CampusAxis?", answer: "A student portal for COMSATS.", sort_order: 1 },
          { id: "2", question: "How to sign in?", answer: "Use your university email.", sort_order: 2 },
        ],
      })
    }

    const supabase = createClient(url, anon)
    const { data, error } = await supabase
      .from("faqs")
      .select("id, question, answer, sort_order")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch FAQs", data: [] },
      { status: 200 }
    )
  }
}
