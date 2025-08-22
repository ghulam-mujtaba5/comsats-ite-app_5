import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { count: pastPapersCount, error: pastPapersError } = await supabase
      .from("past_papers")
      .select("*", { count: "exact", head: true });

    if (pastPapersError) throw pastPapersError;

    const { count: reviewsCount, error: reviewsError } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true });

    if (reviewsError) throw reviewsError;

    return NextResponse.json({
      pastPapersCount: pastPapersCount ?? 0,
      reviewsCount: reviewsCount ?? 0,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: error.message || "Failed to fetch stats" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
