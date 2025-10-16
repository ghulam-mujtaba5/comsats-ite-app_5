import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { withSupabaseRetry, safeCountWithRetry, safeListUsersWithRetry } from '@/lib/retry-utils'

export async function GET() {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }

  try {
    const supabase = supabaseAdmin

    // Users: use Admin API with retry and pagination to get total count
    let totalUsers = 0
    try {
      const perPage = 100
      let page = 1
      
      while (true) {
        const result = await safeListUsersWithRetry(supabase, { page, perPage })
        totalUsers += result.totalCount
        
        if (result.totalCount < perPage) break
        page += 1
        
        // Safety cap to prevent long loops
        if (page > 100) break
      }
    } catch (e) {
      // If admin list fails, leave as 0 but continue
      console.error('dashboard-stats: users count failed:', e)
    }

    // Helper to count a table with retry logic
    const safeCount = async (table: string, filters?: any): Promise<number> => {
      try {
        return await safeCountWithRetry(supabase, table, filters)
      } catch (e) {
        console.error(`dashboard-stats: count failed for ${table}:`, e)
        return 0
      }
    }

    // Get counts for all tables with retry logic
    const [
      lostFoundResult,
      newsResult,
      eventsResult,
      supportRequestsResult,
      guidanceResult,
      faqResult
    ] = await Promise.allSettled([
      safeCount('lost_found_items'),
      safeCount('news_items'),
      safeCount('events'),
      safeCount('support_requests'),
      safeCount('guidance_content'),
      safeCount('faq_items')
    ])

    // Extract values from settled promises
    const extractValue = (result: PromiseSettledResult<number>): number => {
      return result.status === 'fulfilled' ? result.value : 0
    }

    const stats = {
      lostFoundItems: extractValue(lostFoundResult),
      newsItems: extractValue(newsResult),
      events: extractValue(eventsResult),
      supportRequests: extractValue(supportRequestsResult),
      guidanceContent: (extractValue(guidanceResult) + extractValue(faqResult)),
      totalUsers: totalUsers
    }

    return NextResponse.json(stats, { headers })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    
    // Return meaningful fallback data instead of just erroring
    return NextResponse.json({
      lostFoundItems: 0,
      newsItems: 0,
      events: 0,
      supportRequests: 0,
      guidanceContent: 0,
      totalUsers: 0,
      error: 'Failed to fetch current stats, showing fallback data'
    }, { status: 200, headers }) // Return 200 with fallback data instead of 500
  }
}