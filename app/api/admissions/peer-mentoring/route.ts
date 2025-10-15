import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

// Get potential mentors for a student based on their interests
export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { department, program, interests } = body

    // In a real implementation, this would query the database for mentors
    // matching the student's criteria
    const mockMentors = [
      {
        id: 1,
        user_id: 'mentor_1',
        name: 'Ahmed Raza',
        department: 'Computer Science',
        program: 'BSCS',
        graduation_year: 2024,
        rating: 4.9,
        review_count: 32,
        specialization: ['NTS Preparation', 'Merit Calculation', 'Interview Guidance'],
        availability: 'Mon, Wed, Fri - 6PM to 9PM',
        bio: 'Successfully guided 15+ students through the admission process. Specialized in NTS preparation.',
        avatar_url: null
      },
      {
        id: 2,
        user_id: 'mentor_2',
        name: 'Sarah Khan',
        department: 'Software Engineering',
        program: 'BSE',
        graduation_year: 2023,
        rating: 4.8,
        review_count: 28,
        specialization: ['Subject Guides', 'Merit Calculation', 'Department Insights'],
        availability: 'Tue, Thu - 5PM to 8PM',
        bio: 'Expert in helping students understand different departments and their requirements.',
        avatar_url: null
      }
    ]

    // Filter mentors based on department/program if provided
    let matchedMentors = mockMentors
    if (department) {
      matchedMentors = matchedMentors.filter(mentor => 
        mentor.department.toLowerCase().includes(department.toLowerCase())
      )
    }
    
    if (program) {
      matchedMentors = matchedMentors.filter(mentor => 
        mentor.program.toLowerCase().includes(program.toLowerCase())
      )
    }

    return NextResponse.json({
      mentors: matchedMentors,
      total: matchedMentors.length
    })
  } catch (error) {
    console.error('Error matching mentors:', error)
    return NextResponse.json(
      { error: 'Failed to match mentors' },
      { status: 500 }
    )
  }
}

// Get mentor requests for the current user (either as student or mentor)
export async function GET(request: Request) {
  try {
    const user = await requireAuth()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // In a real implementation, this would query the database for mentor requests
    // where the user is either the student or mentor
    const mockRequests = [
      {
        id: 1,
        mentor_id: 1,
        student_id: user.id,
        student_name: 'Current User',
        subject: 'NTS Preparation Help',
        message: 'I need guidance on quantitative reasoning section of NTS. Can you recommend some resources?',
        status: 'pending',
        created_at: '2024-05-15T14:30:00Z',
        updated_at: '2024-05-15T14:30:00Z'
      }
    ]

    return NextResponse.json({
      requests: mockRequests,
      total: mockRequests.length
    })
  } catch (error) {
    console.error('Error fetching mentor requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mentor requests' },
      { status: 500 }
    )
  }
}