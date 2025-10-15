import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

// Get all mentors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const program = searchParams.get('program')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // For now, we'll return mock data since we don't have a specific mentors table yet
    // In a real implementation, this would query a mentors table in the database
    const mockMentors = [
      {
        id: 1,
        user_id: 'user_1',
        name: 'Ahmed Raza',
        department: 'Computer Science',
        program: 'BSCS',
        graduation_year: 2024,
        rating: 4.9,
        review_count: 32,
        specialization: ['NTS Preparation', 'Merit Calculation', 'Interview Guidance'],
        availability: 'Mon, Wed, Fri - 6PM to 9PM',
        bio: 'Successfully guided 15+ students through the admission process. Specialized in NTS preparation.',
        avatar_url: null,
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        user_id: 'user_2',
        name: 'Sarah Khan',
        department: 'Software Engineering',
        program: 'BSE',
        graduation_year: 2023,
        rating: 4.8,
        review_count: 28,
        specialization: ['Subject Guides', 'Merit Calculation', 'Department Insights'],
        availability: 'Tue, Thu - 5PM to 8PM',
        bio: 'Expert in helping students understand different departments and their requirements.',
        avatar_url: null,
        created_at: '2024-02-20T14:15:00Z'
      },
      {
        id: 3,
        user_id: 'user_3',
        name: 'Mohsin Ali',
        department: 'Business Administration',
        program: 'BBA',
        graduation_year: 2024,
        rating: 4.7,
        review_count: 24,
        specialization: ['Interview Preparation', 'Application Process', 'Career Guidance'],
        availability: 'Mon, Wed - 4PM to 7PM',
        bio: 'Focuses on interview preparation and application process for business programs.',
        avatar_url: null,
        created_at: '2024-03-10T09:45:00Z'
      }
    ]

    // Filter by department/program if provided
    let filteredMentors = mockMentors
    if (department) {
      filteredMentors = filteredMentors.filter(mentor => 
        mentor.department.toLowerCase().includes(department.toLowerCase())
      )
    }
    if (program) {
      filteredMentors = filteredMentors.filter(mentor => 
        mentor.program.toLowerCase().includes(program.toLowerCase())
      )
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedMentors = filteredMentors.slice(startIndex, endIndex)

    return NextResponse.json({
      mentors: paginatedMentors,
      total: filteredMentors.length,
      page,
      limit,
      hasMore: endIndex < filteredMentors.length
    })
  } catch (error) {
    console.error('Error fetching mentors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mentors' },
      { status: 500 }
    )
  }
}

// Register as a mentor (requires authentication)
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // In a real implementation, this would insert into a mentors table
    // For now, we'll just return a success response
    const newMentor = {
      id: Date.now(), // Mock ID
      user_id: user.id,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
      department: body.department,
      program: body.program,
      graduation_year: body.graduation_year,
      specialization: body.specialization,
      availability: body.availability,
      bio: body.bio,
      rating: 0,
      review_count: 0,
      created_at: new Date().toISOString()
    }

    return NextResponse.json(newMentor, { status: 201 })
  } catch (error) {
    console.error('Error registering mentor:', error)
    return NextResponse.json(
      { error: 'Failed to register as mentor' },
      { status: 500 }
    )
  }
}