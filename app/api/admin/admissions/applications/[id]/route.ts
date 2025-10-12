import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { verifyAdmin } from '@/lib/admin-utils'

// PATCH /api/admin/admissions/applications/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Resolve the params promise
    const resolvedParams = await params
    const { id } = resolvedParams
    
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

    const body = await req.json()
    
    // Validate status
    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected']
    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: pending, reviewed, accepted, rejected' }, 
        { status: 400 }
      )
    }

    // Update application status
    const { data, error } = await supabase
      .from('admissions_applications')
      .update({ 
        status: body.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update application' }, 
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Application not found' }, 
        { status: 404 }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}