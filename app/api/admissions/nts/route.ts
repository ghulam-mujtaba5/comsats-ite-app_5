import { NextResponse } from 'next/server'

// Get NTS preparation materials
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Mock NTS preparation data
    const mockNtsMaterials = [
      {
        id: 1,
        title: 'Quantitative Reasoning Practice Test',
        subject: 'quantitative',
        description: '20 questions covering basic arithmetic, algebra, and geometry concepts',
        question_count: 20,
        time_limit: 30, // minutes
        difficulty: 'medium',
        url: '#',
        attempts: 1250,
        average_score: 75,
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        title: 'Verbal Reasoning Practice Test',
        subject: 'verbal',
        description: '20 questions testing English comprehension and vocabulary skills',
        question_count: 20,
        time_limit: 30, // minutes
        difficulty: 'medium',
        url: '#',
        attempts: 980,
        average_score: 68,
        created_at: '2024-01-20T14:15:00Z'
      },
      {
        id: 3,
        title: 'Analytical Reasoning Practice Test',
        subject: 'analytical',
        description: '15 questions testing logical reasoning and problem-solving skills',
        question_count: 15,
        time_limit: 25, // minutes
        difficulty: 'hard',
        url: '#',
        attempts: 720,
        average_score: 62,
        created_at: '2024-01-25T09:45:00Z'
      },
      {
        id: 4,
        title: 'Subject Knowledge (Mathematics)',
        subject: 'mathematics',
        description: '25 questions covering intermediate level mathematics concepts',
        question_count: 25,
        time_limit: 40, // minutes
        difficulty: 'hard',
        url: '#',
        attempts: 850,
        average_score: 71,
        created_at: '2024-02-01T11:20:00Z'
      },
      {
        id: 5,
        title: 'Subject Knowledge (Physics)',
        subject: 'physics',
        description: '25 questions covering intermediate level physics concepts',
        question_count: 25,
        time_limit: 40, // minutes
        difficulty: 'hard',
        url: '#',
        attempts: 620,
        average_score: 65,
        created_at: '2024-02-05T16:45:00Z'
      },
      {
        id: 6,
        title: 'Subject Knowledge (Chemistry)',
        subject: 'chemistry',
        description: '25 questions covering intermediate level chemistry concepts',
        question_count: 25,
        time_limit: 40, // minutes
        difficulty: 'medium',
        url: '#',
        attempts: 580,
        average_score: 69,
        created_at: '2024-02-10T13:30:00Z'
      }
    ]

    // Filter by subject if provided
    let filteredMaterials = mockNtsMaterials
    if (subject) {
      filteredMaterials = filteredMaterials.filter(material => 
        material.subject.toLowerCase() === subject.toLowerCase()
      )
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedMaterials = filteredMaterials.slice(startIndex, endIndex)

    return NextResponse.json({
      materials: paginatedMaterials,
      total: filteredMaterials.length,
      page,
      limit,
      hasMore: endIndex < filteredMaterials.length
    })
  } catch (error) {
    console.error('Error fetching NTS materials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch NTS materials' },
      { status: 500 }
    )
  }
}