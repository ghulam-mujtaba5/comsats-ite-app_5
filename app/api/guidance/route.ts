import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const dynamic = 'force-dynamic'

// GET - Fetch guidance materials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const tag = searchParams.get('tag')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('guidance_materials')
      .select(`
        *,
        author:author_id(id, full_name, email, avatar_url)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Public view - only published materials
    if (!status) {
      query = query.eq('status', 'published')
    } else if (status) {
      query = query.eq('status', status)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (difficulty) {
      query = query.eq('difficulty_level', difficulty)
    }

    if (tag) {
      query = query.contains('tags', [tag])
    }

    const { data: materials, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      materials,
      total: count,
      limit,
      offset
    })

  } catch (error: any) {
    console.error('Fetch guidance materials error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch guidance materials' },
      { status: 500 }
    )
  }
}

// POST - Create guidance material
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_id, roles:role_id(name, permissions)')
      .eq('user_id', user.id)

    const canCreate = userRoles?.some((ur: any) => 
      ['super_admin', 'admin', 'faculty'].includes(ur.roles?.name) ||
      ur.roles?.permissions?.create_resources
    )

    if (!canCreate) {
      return NextResponse.json({ error: 'Forbidden - Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      slug,
      content,
      category,
      difficulty_level,
      tags,
      attachments,
      seo_title,
      seo_description,
      seo_keywords,
      status = 'draft'
    } = body

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Create guidance material
    const { data: material, error } = await supabase
      .from('guidance_materials')
      .insert({
        author_id: user.id,
        title,
        slug: finalSlug,
        content,
        category,
        difficulty_level: difficulty_level || 'intermediate',
        tags: tags || [],
        attachments: attachments || {},
        seo_title: seo_title || title,
        seo_description: seo_description || content.substring(0, 160),
        seo_keywords: seo_keywords || tags?.join(', '),
        status
      })
      .select(`
        *,
        author:author_id(id, full_name, email, avatar_url)
      `)
      .single()

    if (error) throw error

    // If published, create notifications
    if (status === 'published') {
      const { data: adminUsers } = await supabase
        .from('user_roles')
        .select('user_id, roles:role_id(name)')
        .in('roles.name', ['super_admin', 'admin'])

      if (adminUsers) {
        const notifications = adminUsers
          .filter((admin: any) => admin.user_id !== user.id)
          .map((admin: any) => ({
            user_id: admin.user_id,
            actor_id: user.id,
            type: 'guidance_published',
            title: 'New Guidance Material Published',
            message: `New ${category} guidance: ${title}`,
            link: `/guidance/${finalSlug}`,
            related_id: material.id,
            related_type: 'guidance'
          }))

        if (notifications.length > 0) {
          await supabase.from('notifications').insert(notifications)
        }
      }
    }

    // Log activity
    await supabase.rpc('log_activity', {
      p_user_id: user.id,
      p_action: 'guidance_created',
      p_resource_type: 'guidance_material',
      p_resource_id: material.id,
      p_details: { title, category, status }
    })

    return NextResponse.json({ material }, { status: 201 })

  } catch (error: any) {
    console.error('Create guidance material error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create guidance material' },
      { status: 500 }
    )
  }
}

// PATCH - Mark as helpful
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { materialId, helpful } = body

    if (!materialId || typeof helpful !== 'boolean') {
      return NextResponse.json(
        { error: 'Material ID and helpful status required' },
        { status: 400 }
      )
    }

    const { data: material } = await supabase
      .from('guidance_materials')
      .select('helpful_count')
      .eq('id', materialId)
      .single()

    const newCount = (material?.helpful_count || 0) + (helpful ? 1 : -1)

    const { data: updated, error } = await supabase
      .from('guidance_materials')
      .update({ helpful_count: Math.max(0, newCount) })
      .eq('id', materialId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ material: updated })

  } catch (error: any) {
    console.error('Update helpful count error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update helpful count' },
      { status: 500 }
    )
  }
}
