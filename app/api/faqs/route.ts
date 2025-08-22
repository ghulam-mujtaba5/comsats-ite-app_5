import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("faqs")
      .select("id, question, answer, sort_order")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: error.message || "Failed to fetch FAQs" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
