import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { verifyAdmin } from '@/lib/admin-utils'

// GET /api/admin/admissions/stats
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await (cookies() as any)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
          remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
        },
      }
    )

    // Verify admin access
    const isAdmin = await verifyAdmin(supabase)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized access' }, 
        { status: 403 }
      )
    }

    // Fetch statistics
    const { count: total, error: totalError } = await supabase
      .from('admissions_applications')
      .select('*', { count: 'exact', head: true })

    if (totalError) {
      console.error('Database error (total):', totalError)
      return NextResponse.json(
        { error: 'Failed to fetch total applications' }, 
        { status: 500 }
      )
    }

    const { count: pending, error: pendingError } = await supabase
      .from('admissions_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    if (pendingError) {
      console.error('Database error (pending):', pendingError)
      return NextResponse.json(
        { error: 'Failed to fetch pending applications' }, 
        { status: 500 }
      )
    }

    const { count: reviewed, error: reviewedError } = await supabase
      .from('admissions_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'reviewed')

    if (reviewedError) {
      console.error('Database error (reviewed):', reviewedError)
      return NextResponse.json(
        { error: 'Failed to fetch reviewed applications' }, 
        { status: 500 }
      )
    }

    const { count: accepted, error: acceptedError } = await supabase
      .from('admissions_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'accepted')

    if (acceptedError) {
      console.error('Database error (accepted):', acceptedError)
      return NextResponse.json(
        { error: 'Failed to fetch accepted applications' }, 
        { status: 500 }
      )
    }

    const { count: rejected, error: rejectedError } = await supabase
      .from('admissions_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected')

    if (rejectedError) {
      console.error('Database error (rejected):', rejectedError)
      return NextResponse.json(
        { error: 'Failed to fetch rejected applications' }, 
        { status: 500 }
      )
    }

    return NextResponse.json({
      total: total || 0,
      pending: pending || 0,
      reviewed: reviewed || 0,
      accepted: accepted || 0,
      rejected: rejected || 0
    }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}