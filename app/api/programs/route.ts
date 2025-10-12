import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// GET /api/programs?department_id=...
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

    const { searchParams } = new URL(req.url)
    const departmentId = searchParams.get('department_id')

    if (!departmentId) {
      return NextResponse.json(
        { error: 'Department ID is required' }, 
        { status: 400 }
      )
    }

    // Fetch programs for the specified department
    const { data, error } = await supabase
      .from('programs')
      .select('id, name, degree_type, duration')
      .eq('department_id', departmentId)
      .order('name')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch programs' }, 
        { status: 500 }
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