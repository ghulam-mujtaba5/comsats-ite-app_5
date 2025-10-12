import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// POST /api/admissions/applications
export async function POST(req: NextRequest) {
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

    const body = await req.json()
    
    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'cnic', 'fatherName', 'campus', 'department', 'program', 'matricMarks', 'interMarks', 'entryTestMarks']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` }, 
          { status: 400 }
        )
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' }, 
        { status: 400 }
      )
    }
    
    // Validate marks (should be between 0 and 100)
    const matric = parseFloat(body.matricMarks)
    const inter = parseFloat(body.interMarks)
    const entryTest = parseFloat(body.entryTestMarks)
    
    if (isNaN(matric) || matric < 0 || matric > 100) {
      return NextResponse.json(
        { error: 'Matric marks must be a number between 0 and 100' }, 
        { status: 400 }
      )
    }
    
    if (isNaN(inter) || inter < 0 || inter > 100) {
      return NextResponse.json(
        { error: 'Intermediate marks must be a number between 0 and 100' }, 
        { status: 400 }
      )
    }
    
    if (isNaN(entryTest) || entryTest < 0 || entryTest > 100) {
      return NextResponse.json(
        { error: 'Entry test marks must be a number between 0 and 100' }, 
        { status: 400 }
      )
    }
    
    // Calculate aggregate (10% Matric + 40% Inter + 50% Entry Test)
    const aggregate = (matric * 0.1) + (inter * 0.4) + (entryTest * 0.5)
    
    // Insert application into database
    const { data, error } = await supabase
      .from('admissions_applications')
      .insert({
        full_name: body.fullName,
        email: body.email,
        phone: body.phone,
        cnic: body.cnic,
        father_name: body.fatherName,
        campus_id: body.campus,
        department_id: body.department,
        program_id: body.program,
        matric_marks: matric,
        inter_marks: inter,
        entry_test_marks: entryTest,
        aggregate: aggregate,
        message: body.message || null,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to submit application' }, 
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Application submitted successfully', data }, 
      { status: 201 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}