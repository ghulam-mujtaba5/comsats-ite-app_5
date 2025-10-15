import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-access'

// Get pending moderation items
export async function GET(request: Request) {
  try {
    const access = await requireAdmin(request)
    if (!access.allow) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
    }

    // In a real implementation, this would query the database for pending items
    // For now, we'll return mock data
    const mockItems = [
      {
        id: "1",
        type: "mentor",
        title: "New Mentor Registration - Ahmed Raza",
        description: "Computer Science - BSCS",
        status: "pending",
        submittedBy: "ahmed.raza@student.com",
        submittedAt: "2024-05-15T14:30:00Z",
        content: "Experienced in NTS preparation and merit calculation. Available Mon, Wed, Fri."
      },
      {
        id: "2",
        type: "resource",
        title: "Study Notes - NTS Quantitative",
        description: "PDF file with practice questions",
        status: "pending",
        submittedBy: "sarah.khan@student.com",
        submittedAt: "2024-05-14T10:15:00Z",
        department: "All Departments",
        program: "All Programs"
      },
      {
        id: "3",
        type: "question",
        title: "Admission Query - Merit Calculation",
        description: "How to calculate merit for BBA program?",
        status: "pending",
        submittedBy: "bilal.ahmed@student.com",
        submittedAt: "2024-05-13T16:45:00Z",
        content: "Can you explain the merit calculation process for BBA? Is NTS required?"
      },
      {
        id: "4",
        type: "review",
        title: "Mentor Review - Fatima Khan",
        description: "Rating: 5 stars - Excellent guidance",
        status: "pending",
        submittedBy: "usman.ali@student.com",
        submittedAt: "2024-05-12T09:30:00Z",
        content: "Very helpful with NTS preparation. Provided excellent study materials."
      }
    ]

    return NextResponse.json({
      items: mockItems,
      total: mockItems.length
    })
  } catch (error) {
    console.error('Error fetching moderation items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch moderation items' },
      { status: 500 }
    )
  }
}

// Update moderation item status
export async function PUT(request: Request) {
  try {
    const access = await requireAdmin(request)
    if (!access.allow) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
        { status: 400 }
      )
    }

    // In a real implementation, this would update the database
    // For now, we'll just return success
    return NextResponse.json({
      message: `Item ${id} has been ${status}`,
      id,
      status
    })
  } catch (error) {
    console.error('Error updating moderation item:', error)
    return NextResponse.json(
      { error: 'Failed to update moderation item' },
      { status: 500 }
    )
  }
}