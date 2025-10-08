import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Helper function to check admin access
async function checkAdminAccess(request: NextRequest) {
  const cookieStore = await cookies()
  const serverClient = createServerClient(
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
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return false
  
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', user.id)
    .single()
  
  return adminUser?.role === 'super_admin' || adminUser?.role === 'admin'
}

// Admin: Approve or reject pending faculty
export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const isAdmin = await checkAdminAccess(request)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { pendingFacultyId, action, reviewerNotes } = body // action: 'approve' or 'reject'

    if (!pendingFacultyId || !action) {
      return NextResponse.json({ 
        error: 'Pending faculty ID and action are required' 
      }, { status: 400 })
    }

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json({ 
        error: 'Action must be "approve" or "reject"' 
      }, { status: 400 })
    }

    // Get pending faculty details
    const { data: pendingFaculty, error: fetchError } = await supabase
      .from('pending_faculty')
      .select('*')
      .eq('id', pendingFacultyId)
      .single()

    if (fetchError || !pendingFaculty) {
      return NextResponse.json({ 
        error: 'Pending faculty not found' 
      }, { status: 404 })
    }

    if (action === 'approve') {
      // Move to main faculty table
      const { data: newFaculty, error: insertError } = await supabase
        .from('faculty')
        .insert({
          name: pendingFaculty.name,
          department: pendingFaculty.department,
          designation: pendingFaculty.designation,
          email: pendingFaculty.email,
          phone: pendingFaculty.phone,
          specialization: pendingFaculty.specialization,
          qualifications: pendingFaculty.qualifications,
          campus_id: pendingFaculty.campus_id,
          status: 'active',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Update pending status
      await supabase
        .from('pending_faculty')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewer_notes: reviewerNotes,
          approved_faculty_id: newFaculty.id
        })
        .eq('id', pendingFacultyId)

      return NextResponse.json({
        message: 'Faculty approved and added to the system',
        faculty: newFaculty
      })
    } else {
      // Reject
      await supabase
        .from('pending_faculty')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewer_notes: reviewerNotes
        })
        .eq('id', pendingFacultyId)

      return NextResponse.json({
        message: 'Faculty submission rejected',
        notes: reviewerNotes
      })
    }
  } catch (error) {
    console.error('Error processing faculty approval:', error)
    return NextResponse.json({ 
      error: 'Failed to process approval' 
    }, { status: 500 })
  }
}

// Get all pending faculty for admin review
export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const isAdmin = await checkAdminAccess(request)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'

    const { data, error } = await supabase
      .from('pending_faculty')
      .select(`
        *,
        campus:campuses(name, code),
        submitter:users!submitted_by(email, full_name)
      `)
      .eq('status', status)
      .order('submitted_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      pendingFaculty: data || [],
      count: data?.length || 0
    })
  } catch (error) {
    console.error('Error fetching pending faculty for admin:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch pending faculty' 
    }, { status: 500 })
  }
}
