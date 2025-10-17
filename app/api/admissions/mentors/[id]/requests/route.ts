import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'

// Create a mentoring request
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: mentorId } = await params
    const body = await request.json()
    
    // Validate required fields
    if (!body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      )
    }

    // In a real implementation, this would insert into a mentor_requests table
    // For now, we'll return a mock response
    const newRequest = {
      id: Date.now(), // Mock ID
      mentor_id: parseInt(mentorId),
      student_id: user.id,
      student_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
      subject: body.subject,
      message: body.message,
      status: 'pending', // pending, accepted, rejected, completed
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // In a real implementation, we would also send a notification to the mentor
    // and possibly an email notification

    return NextResponse.json(newRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating mentor request:', error)
    return NextResponse.json(
      { error: 'Failed to create mentor request' },
      { status: 500 }
    )
  }
}

// Get mentoring requests for a mentor (requires authentication)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: mentorId } = await params
    
    // In a real implementation, this would check if the authenticated user is the mentor
    // and then fetch their requests from the database
    
    // For now, return mock data
    const mockRequests = [
      {
        id: 1,
        mentor_id: parseInt(mentorId),
        student_id: 'student_1',
        student_name: 'Ali Hassan',
        subject: 'NTS Preparation Help',
        message: 'I need guidance on quantitative reasoning section of NTS. Can you recommend some resources?',
        status: 'pending',
        created_at: '2024-05-15T14:30:00Z',
        updated_at: '2024-05-15T14:30:00Z'
      },
      {
        id: 2,
        mentor_id: parseInt(mentorId),
        student_id: 'student_2',
        student_name: 'Ayesha Malik',
        subject: 'Merit Calculation',
        message: 'Could you help me calculate my merit score based on my academic record?',
        status: 'accepted',
        created_at: '2024-05-10T11:15:00Z',
        updated_at: '2024-05-11T09:30:00Z'
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