import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export const revalidate = 300 // Revalidate every 5 minutes (increased from 1 minute)

export async function GET() {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

  try {
    // 1. Get total faculty members using count query to reduce CPU usage
    const { count: facultyCount, error: facultyError } = await supabaseAdmin
      .from("faculty")
      .select("id", { count: "exact", head: true })
      .eq('status', 'approved');
    
    if (facultyError) {
      console.error("Faculty count error:", facultyError);
      // Return default values instead of throwing error
      return NextResponse.json({
        facultyCount: 0,
        totalReviews: 0,
        averageRating: 0,
        departmentCount: 0,
      }, { headers });
    }

    // 2. Get total reviews using count query
    const { count: totalReviews, error: reviewCountError } = await supabaseAdmin
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq('status', 'approved');
    
    if (reviewCountError) {
      console.error("Review count error:", reviewCountError);
      // Continue with default value
      return NextResponse.json({
        facultyCount: facultyCount || 0,
        totalReviews: 0,
        averageRating: 0,
        departmentCount: 0,
      }, { headers });
    }

    // Get average rating using avg aggregate function
    const { data: avgData, error: avgError } = await supabaseAdmin
      .from("reviews")
      .select("rating")
      .eq('status', 'approved');
    
    if (avgError) {
      console.error("Average rating error:", avgError);
      // Continue with default value
      return NextResponse.json({
        facultyCount: facultyCount || 0,
        totalReviews: totalReviews || 0,
        averageRating: 0,
        departmentCount: 0,
      }, { headers });
    }

    const averageRating =
      avgData && avgData.length > 0
        ? avgData.reduce((acc, review) => acc + review.rating, 0) / avgData.length
        : 0;

    // 3. Get total unique departments using distinct query
    const { data: departmentData, error: departmentError } = await supabaseAdmin
      .from("faculty")
      .select("department")
      .eq('status', 'approved')
      .neq('department', null); // Exclude null departments
    
    if (departmentError) {
      console.error("Department error:", departmentError);
      // Continue with default value
      return NextResponse.json({
        facultyCount: facultyCount || 0,
        totalReviews: totalReviews || 0,
        averageRating: Number(averageRating.toFixed(2)),
        departmentCount: 0,
      }, { headers });
    }

    // Use Set to get unique departments more efficiently
    const departmentSet = new Set(departmentData?.map((f) => f.department).filter(Boolean));
    const departmentCount = departmentSet.size;

    return NextResponse.json({
      facultyCount: facultyCount || 0,
      totalReviews: totalReviews || 0,
      averageRating: Number(averageRating.toFixed(2)), // Round to 2 decimal places
      departmentCount,
    }, { headers });
  } catch (error: any) {
    console.error("Unexpected error in faculty stats API:", error);
    // Return default values in case of any unexpected error
    return NextResponse.json({
      facultyCount: 0,
      totalReviews: 0,
      averageRating: 0,
      departmentCount: 0,
    }, { 
      status: 200, // Changed to 200 to avoid triggering error boundary
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
}