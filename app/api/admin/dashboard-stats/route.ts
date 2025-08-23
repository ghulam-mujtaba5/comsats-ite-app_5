import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const supabase = supabaseAdmin

    // Users: use Admin API and paginate to get total count
    let totalUsers = 0
    try {
      const perPage = 100
      let page = 1
      while (true) {
        const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
        if (error) throw error
        const users = data?.users ?? []
        totalUsers += users.length
        if (users.length < perPage) break
        page += 1
        // Safety cap to prevent long loops
        if (page > 100) break
      }
    } catch (e) {
      // If admin list fails, leave as 0 but continue
      console.error('dashboard-stats: users count failed:', e)
    }

    // Helper to count a table but not fail the whole response
    const safeCount = async (table: string) => {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
        if (error) throw error
        return count ?? 0
      } catch (e) {
        console.error(`dashboard-stats: count failed for ${table}:`, e)
        return 0
      }
    }

    const [totalFaculty, totalReviews, totalResources] = await Promise.all([
      safeCount('faculty'),
      safeCount('reviews'),
      safeCount('resources'),
    ])

    return NextResponse.json({
      totalUsers,
      totalFaculty,
      totalReviews,
      totalResources,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
