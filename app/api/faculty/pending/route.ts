import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Student-submitted faculty (pending admin approval)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      department, 
      designation, 
      email, 
      phone,
      specialization,
      qualifications,
      campus_id,
      submitted_by 
    } = body

    // Validation
    if (!name || !department || !campus_id || !submitted_by) {
      return NextResponse.json({ 
        error: 'Name, department, campus, and submitter are required' 
      }, { status: 400 })
    }

    // Check if faculty already exists (approved or pending)
    const { data: existingFaculty } = await supabase
      .from('faculty')
      .select('id, name, status')
      .ilike('name', name)
      .eq('campus_id', campus_id)
      .single()

    if (existingFaculty) {
      return NextResponse.json({ 
        error: `Faculty member "${name}" already exists`,
        status: existingFaculty.status,
        facultyId: existingFaculty.id
      }, { status: 409 })
    }

    // Check pending submissions
    const { data: pendingFaculty } = await supabase
      .from('pending_faculty')
      .select('id, name')
      .ilike('name', name)
      .eq('campus_id', campus_id)
      .single()

    if (pendingFaculty) {
      return NextResponse.json({ 
        error: `Faculty member "${name}" is already pending admin approval`,
        facultyId: pendingFaculty.id
      }, { status: 409 })
    }

    // Create pending faculty entry
    const { data, error } = await supabase
      .from('pending_faculty')
      .insert({
        name,
        department,
        designation: designation || 'Lecturer',
        email,
        phone,
        specialization,
        qualifications,
        campus_id,
        submitted_by,
        status: 'pending', // pending, approved, rejected
        submitted_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      message: 'Faculty submitted for admin approval',
      faculty: data,
      note: 'Once approved by admin, you can write reviews for this faculty member'
    }, { status: 201 })
  } catch (error) {
    console.error('Error submitting faculty:', error)
    return NextResponse.json({ 
      error: 'Failed to submit faculty for approval' 
    }, { status: 500 })
  }
}

// Get pending faculty submissions (for students to see their submissions)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const campusId = searchParams.get('campusId')
    const status = searchParams.get('status') // pending, approved, rejected

    let query = supabase
      .from('pending_faculty')
      .select('*, campus:campuses(name)')
      .order('submitted_at', { ascending: false })

    if (userId) {
      query = query.eq('submitted_by', userId)
    }

    if (campusId) {
      query = query.eq('campus_id', campusId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({
      pendingFaculty: data || [],
      count: data?.length || 0
    })
  } catch (error) {
    console.error('Error fetching pending faculty:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch pending faculty' 
    }, { status: 500 })
  }
}
