import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

async function checkAdminAccess(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { isAdmin: false, user: null }
  }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', user.id)
    .single()

  return { isAdmin: !!adminUser, user }
}

export async function GET(request: NextRequest) {
  const cookieStore = await (cookies() as any)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options)
        },
        remove(name: string, options: any) {
          cookieStore.set(name, '', { ...(options || {}), maxAge: 0 })
        },
      },
    }
  )
  
  const { isAdmin } = await checkAdminAccess(supabase)
  
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    // Get counts for all tables
    const [
      lostFoundResult,
      newsResult,
      eventsResult,
      supportRequestsResult,
      guidanceResult,
      faqResult,
      usersResult
    ] = await Promise.all([
      supabase.from('lost_found_items').select('*', { count: 'exact', head: true }),
      supabase.from('news_items').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('support_requests').select('*', { count: 'exact', head: true }),
      supabase.from('guidance_content').select('*', { count: 'exact', head: true }),
      supabase.from('faq_items').select('*', { count: 'exact', head: true }),
      supabase.auth.admin.listUsers()
    ])

    const stats = {
      lostFoundItems: lostFoundResult.count || 0,
      newsItems: newsResult.count || 0,
      events: eventsResult.count || 0,
      supportRequests: supportRequestsResult.count || 0,
      guidanceContent: (guidanceResult.count || 0) + (faqResult.count || 0),
      totalUsers: usersResult.data?.users?.length || 0
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
