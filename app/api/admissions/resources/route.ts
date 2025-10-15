import { NextResponse } from 'next/server'

// Get admission resources
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Mock resources data
    const mockResources = [
      {
        id: 1,
        title: 'NTS Preparation Guide',
        description: 'Comprehensive guide for National Testing Service preparation with practice questions and tips',
        category: 'nts',
        type: 'pdf',
        size: '2.4 MB',
        url: '#',
        downloads: 1240,
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        title: 'Merit Calculation Tool',
        description: 'Interactive calculator to estimate your admission merit based on academic performance',
        category: 'tools',
        type: 'calculator',
        size: 'Online',
        url: '#',
        downloads: 890,
        created_at: '2024-02-20T14:15:00Z'
      },
      {
        id: 3,
        title: 'Past Entrance Papers',
        description: 'Collection of previous years\' entrance exam papers with solutions',
        category: 'papers',
        type: 'collection',
        size: '15 files',
        url: '#',
        downloads: 2100,
        created_at: '2024-03-10T09:45:00Z'
      },
      {
        id: 4,
        title: 'Department Guides',
        description: 'Detailed information about different departments and their admission requirements',
        category: 'guides',
        type: 'documents',
        size: '8 files',
        url: '#',
        downloads: 750,
        created_at: '2024-01-25T11:20:00Z'
      },
      {
        id: 5,
        title: 'Interview Tips',
        description: 'Video guide with tips and common questions for admission interviews',
        category: 'interview',
        type: 'video',
        size: '45 min',
        url: '#',
        downloads: 620,
        created_at: '2024-02-05T16:45:00Z'
      },
      {
        id: 6,
        title: 'Subject-wise Notes',
        description: 'Comprehensive notes for key subjects tested in entrance exams',
        category: 'notes',
        type: 'notes',
        size: '12 files',
        url: '#',
        downloads: 1800,
        created_at: '2024-03-01T13:30:00Z'
      }
    ]

    // Filter by category if provided
    let filteredResources = mockResources
    if (category) {
      filteredResources = filteredResources.filter(resource => 
        resource.category.toLowerCase() === category.toLowerCase()
      )
    }
    
    // Filter by search term if provided
    if (search) {
      filteredResources = filteredResources.filter(resource => 
        resource.title.toLowerCase().includes(search.toLowerCase()) ||
        resource.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedResources = filteredResources.slice(startIndex, endIndex)

    return NextResponse.json({
      resources: paginatedResources,
      total: filteredResources.length,
      page,
      limit,
      hasMore: endIndex < filteredResources.length
    })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}

// Upload a new resource (requires admin authentication)
export async function POST(request: Request) {
  try {
    // In a real implementation, this would require admin authentication
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.category || !body.type) {
      return NextResponse.json(
        { error: 'Title, category, and type are required' },
        { status: 400 }
      )
    }

    // In a real implementation, this would insert into a resources table
    // For now, we'll return a mock response
    const newResource = {
      id: Date.now(), // Mock ID
      title: body.title,
      description: body.description,
      category: body.category,
      type: body.type,
      size: body.size || 'Unknown',
      url: body.url || '#',
      downloads: 0,
      created_at: new Date().toISOString()
    }

    return NextResponse.json(newResource, { status: 201 })
  } catch (error) {
    console.error('Error uploading resource:', error)
    return NextResponse.json(
      { error: 'Failed to upload resource' },
      { status: 500 }
    )
  }
}