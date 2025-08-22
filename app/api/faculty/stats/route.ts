import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export const revalidate = 60 // Revalidate every 60 seconds

export async function GET() {
  try {
    // 1. Get total faculty members
    const { count: facultyCount, error: facultyError } = await supabaseAdmin
      .from("faculty")
      .select("*", { count: "exact", head: true });
    if (facultyError) throw facultyError;

    // 2. Get total reviews and average rating
    const { data: reviewData, error: reviewError } = await supabaseAdmin
      .from("reviews")
      .select("rating");
    if (reviewError) throw reviewError;

    const totalReviews = reviewData?.length || 0;
    const averageRating =
      totalReviews > 0
        ? (reviewData?.reduce((acc, review) => acc + review.rating, 0) || 0) / totalReviews
        : 0;

    // 3. Get total unique departments
    const { data: departmentData, error: departmentError } = await supabaseAdmin
      .from("faculty")
      .select("department");
    if (departmentError) throw departmentError;

    const departmentSet = new Set(departmentData?.map((f) => f.department).filter(Boolean));
    const departmentCount = departmentSet.size;

    return NextResponse.json({
      facultyCount,
      totalReviews,
      averageRating,
      departmentCount,
    });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
