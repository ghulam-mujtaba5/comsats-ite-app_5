import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !anon) {
      return NextResponse.json({ pastPapersCount: 0, reviewsCount: 0 })
    }

    const supabase = createClient(url, anon)

    const { count: pastPapersCount, error: pastPapersError } = await supabase
      .from("past_papers")
      .select("*", { count: "exact", head: true });

    if (pastPapersError) throw pastPapersError;

    const { count: reviewsCount, error: reviewsError } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq('status', 'approved');

    if (reviewsError) throw reviewsError;

    return NextResponse.json({
      pastPapersCount: pastPapersCount ?? 0,
      reviewsCount: reviewsCount ?? 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch stats", pastPapersCount: 0, reviewsCount: 0 },
      { status: 200 }
    )
  }
}
