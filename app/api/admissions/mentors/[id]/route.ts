import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Get mentor details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const mentorId = params.id

    // For now, we'll return mock data
    // In a real implementation, this would query the mentors table
    const mockMentor = {
      id: parseInt(mentorId),
      user_id: `user_${mentorId}`,
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
      created_at: '2024-01-15T10:30:00Z',
      resources: [
        { 
          id: 1, 
          title: 'NTS Quantitative Guide', 
          type: 'PDF', 
          size: '1.2 MB',
          url: '#'
        },
        { 
          id: 2, 
          title: 'Verbal Reasoning Tips', 
          type: 'Document', 
          size: '800 KB',
          url: '#'
        },
        { 
          id: 3, 
          title: 'Merit Calculation Sheet', 
          type: 'Spreadsheet', 
          size: '200 KB',
          url: '#'
        },
        { 
          id: 4, 
          title: 'Interview Preparation', 
          type: 'Guide', 
          size: '1.5 MB',
          url: '#'
        }
      ],
      success_stories: [
        { name: 'Fatima Khan', program: 'BSCS', year: '2024', score: '85% Merit' },
        { name: 'Usman Ali', program: 'BSE', year: '2024', score: '82% Merit' },
        { name: 'Zara Ahmed', program: 'BBA', year: '2024', score: '78% Merit' }
      ]
    }

    // Mock reviews
    const mockReviews = [
      {
        id: 1,
        user_id: 'student_1',
        user_name: 'Ali Hassan',
        rating: 5,
        comment: 'Extremely helpful guidance for my NTS preparation. Provided excellent study materials and tips.',
        created_at: '2024-05-15T14:30:00Z'
      },
      {
        id: 2,
        user_id: 'student_2',
        user_name: 'Ayesha Malik',
        rating: 5,
        comment: 'Very knowledgeable about the admission process. Helped me understand the merit calculation perfectly.',
        created_at: '2024-04-22T11:15:00Z'
      },
      {
        id: 3,
        user_id: 'student_3',
        user_name: 'Bilal Shah',
        rating: 4,
        comment: 'Good mentor with practical advice. Sessions were well-structured and informative.',
        created_at: '2024-03-30T09:45:00Z'
      }
    ]

    return NextResponse.json({
      mentor: mockMentor,
      reviews: mockReviews
    })
  } catch (error) {
    console.error('Error fetching mentor details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mentor details' },
      { status: 500 }
    )
  }
}

// Update mentor profile (requires authentication)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // In a real implementation, this would require authentication and check if the user owns this mentor profile
    const body = await request.json()
    
    // For now, just return success
    return NextResponse.json({ 
      message: 'Mentor profile updated successfully',
      mentor: { id: params.id, ...body }
    })
  } catch (error) {
    console.error('Error updating mentor:', error)
    return NextResponse.json(
      { error: 'Failed to update mentor profile' },
      { status: 500 }
    )
  }
}