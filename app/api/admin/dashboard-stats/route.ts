import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const supabase = supabaseAdmin;

    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (usersError) throw usersError;

    const { count: totalFaculty, error: facultyError } = await supabase
      .from('faculty')
      .select('*', { count: 'exact', head: true });

    if (facultyError) throw facultyError;

    const { count: totalReviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true });

    if (reviewsError) throw reviewsError;

    const { count: totalResources, error: resourcesError } = await supabase
      .from('resources')
      .select('*', { count: 'exact', head: true });

    if (resourcesError) throw resourcesError;

    return NextResponse.json({
      totalUsers,
      totalFaculty,
      totalReviews,
      totalResources,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
