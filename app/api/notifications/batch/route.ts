import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/admin-access'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const headers = {
  'Cache-Control': 'no-store, must-revalidate',
  'CDN-Cache-Control': 'no-store',
}

// POST - Create a new batch notification
export async function POST(req: NextRequest) {
  try {
    // Check admin access
    const access = await requireAdmin(req)
    if (!access.allow) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    // Get request body
    const body = await req.json()
    const { name, description, recipients, notification_template, email_template, scheduled_for } = body

    // Validate required fields
    if (!name || !recipients || !notification_template) {
      return NextResponse.json({ 
        error: 'name, recipients, and notification_template are required' 
      }, { status: 400, headers })
    }

    // Validate recipients format
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ 
        error: 'recipients must be a non-empty array' 
      }, { status: 400, headers })
    }

    // Validate notification template
    if (!notification_template.title || !notification_template.message) {
      return NextResponse.json({ 
        error: 'notification_template must include title and message' 
      }, { status: 400, headers })
    }

    // Create batch notification entry
    const { data, error } = await supabase
      .from('batch_notifications')
      .insert({
        name,
        description,
        recipients,
        notification_template,
        email_template,
        scheduled_for: scheduled_for || new Date().toISOString(),
        created_by: user.id,
        total_recipients: recipients.length
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating batch notification:', error)
      return NextResponse.json({ error: 'Failed to create batch notification' }, { status: 500, headers })
    }

    return NextResponse.json({ 
      success: true,
      batch_notification: data,
      message: 'Batch notification created successfully'
    }, { status: 201, headers })

  } catch (error: any) {
    console.error('Create batch notification error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers }
    )
  }
}

// GET - Get batch notifications
export async function GET(req: NextRequest) {
  try {
    // Check admin access
    const access = await requireAdmin(req)
    if (!access.allow) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status')

    let query = supabase
      .from('batch_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching batch notifications:', error)
      return NextResponse.json({ error: 'Failed to fetch batch notifications' }, { status: 500, headers })
    }

    // Get total count
    const { count, error: countError } = await supabase
      .from('batch_notifications')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Error counting batch notifications:', countError)
    }

    return NextResponse.json({ 
      batch_notifications: data,
      count: count || 0
    }, { headers })

  } catch (error: any) {
    console.error('Get batch notifications error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers }
    )
  }
}

// PATCH - Update batch notification status
export async function PATCH(req: NextRequest) {
  try {
    // Check admin access
    const access = await requireAdmin(req)
    if (!access.allow) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    // Get request body
    const body = await req.json()
    const { id, status, error_message } = body

    // Validate required fields
    if (!id || !status) {
      return NextResponse.json({ 
        error: 'id and status are required' 
      }, { status: 400, headers })
    }

    // Validate status
    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: `Invalid status. Valid statuses: ${validStatuses.join(', ')}` 
      }, { status: 400, headers })
    }

    // Update batch notification
    const updateData: any = { status }
    if (error_message) updateData.error_message = error_message
    
    // Update timestamps based on status
    const now = new Date().toISOString()
    if (status === 'processing') updateData.started_at = now
    if (status === 'completed') updateData.completed_at = now
    if (status === 'failed') updateData.failed_at = now

    const { data, error } = await supabase
      .from('batch_notifications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating batch notification:', error)
      return NextResponse.json({ error: 'Failed to update batch notification' }, { status: 500, headers })
    }

    return NextResponse.json({ 
      success: true,
      batch_notification: data,
      message: 'Batch notification updated successfully'
    }, { headers })

  } catch (error: any) {
    console.error('Update batch notification error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers }
    )
  }
}

// DELETE - Delete batch notification
export async function DELETE(req: NextRequest) {
  try {
    // Check admin access
    const access = await requireAdmin(req)
    if (!access.allow) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ 
        error: 'id is required' 
      }, { status: 400, headers })
    }

    // Delete batch notification
    const { error } = await supabase
      .from('batch_notifications')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting batch notification:', error)
      return NextResponse.json({ error: 'Failed to delete batch notification' }, { status: 500, headers })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Batch notification deleted successfully'
    }, { headers })

  } catch (error: any) {
    console.error('Delete batch notification error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers }
    )
  }
}