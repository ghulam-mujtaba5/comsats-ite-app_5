import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { rateLimit, RateLimitPresets, getRateLimitHeaders } from '@/lib/rate-limit'

const headers = {
  'Cache-Control': 'no-store, must-revalidate',
  'CDN-Cache-Control': 'no-store',
}

export async function POST(req: NextRequest) {
  try {
    // 1. Create Supabase client
    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    })

    // 2. Get user (optional - allow anonymous with stricter rate limiting)
    const { data: { user } } = await supabase.auth.getUser()
    
    // 3. Rate limiting
    const limitKey = user?.id || req.headers.get('x-forwarded-for') || 'anonymous'
    const rateCheck = await rateLimit(req, {
      ...RateLimitPresets.upload,
      keyGenerator: () => `resource-upload:${limitKey}`,
      limit: user ? 10 : 3, // Authenticated users: 10/hour, Anonymous: 3/hour
    })

    if (!rateCheck.success) {
      const res = NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.', retryAfter: rateCheck.retryAfter },
        { status: 429, headers }
      )
      Object.entries(getRateLimitHeaders(rateCheck)).forEach(([key, value]) => {
        res.headers.set(key, value)
      })
      return res
    }

    // 4. Parse form data
    const formData = await req.formData()
    const title = (formData.get('title') as string || '').trim()
    const description = (formData.get('description') as string || '').trim()
    const type = (formData.get('type') as string || '').trim()
    const department = (formData.get('department') as string || '').trim()
    const difficulty = (formData.get('difficulty') as string || '').trim()
    const tags = (formData.get('tags') as string || '').trim()
    const url = (formData.get('url') as string || '').trim()
    const file = formData.get('file') as File | null

    // 5. Validation
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400, headers })
    }
    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400, headers })
    }
    if (!type) {
      return NextResponse.json({ error: 'Resource type is required' }, { status: 400, headers })
    }
    if (!department) {
      return NextResponse.json({ error: 'Department is required' }, { status: 400, headers })
    }
    if (!file && !url) {
      return NextResponse.json({ error: 'Please provide either a file or URL' }, { status: 400, headers })
    }

    // 6. Validate file if provided
    if (file) {
      const maxSize = 50 * 1024 * 1024 // 50MB
      if (file.size > maxSize) {
        return NextResponse.json({ error: 'File size exceeds 50MB limit' }, { status: 400, headers })
      }

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'application/zip',
        'application/x-zip-compressed'
      ]

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ 
          error: 'Invalid file type. Supported: PDF, DOC, DOCX, PPT, PPTX, TXT, ZIP' 
        }, { status: 400, headers })
      }
    }

    // 7. Validate URL if provided
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      return NextResponse.json({ error: 'URL must start with http:// or https://' }, { status: 400, headers })
    }

    // 8. Upload file to Supabase Storage if provided
    let fileUrl: string | null = null
    let storagePath: string | null = null
    let fileSize: number | null = null
    let mimeType: string | null = null

    if (file) {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      storagePath = `pending/${fileName}`

      const fileBuffer = await file.arrayBuffer()
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resources')
        .upload(storagePath, fileBuffer, {
          contentType: file.type,
          upsert: false
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        return NextResponse.json({ 
          error: 'Failed to upload file to storage. Please try again.' 
        }, { status: 500, headers })
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('resources')
        .getPublicUrl(uploadData.path)

      fileUrl = publicUrlData.publicUrl
      fileSize = file.size
      mimeType = file.type
    }

    // 9. Parse tags
    const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []

    // 10. Insert into database with status='pending'
    const { data: insertData, error: insertError } = await supabase
      .from('resources')
      .insert({
        title,
        description,
        type,
        department,
        difficulty: difficulty || null,
        tags: tagsArray,
        external_url: url || null,
        file_url: fileUrl,
        storage_path: storagePath,
        size_bytes: fileSize,
        mime_type: mimeType,
        status: 'pending',
        uploaded_by: user?.id || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      
      // Cleanup: delete uploaded file if database insert fails
      if (storagePath) {
        await supabase.storage.from('resources').remove([storagePath])
      }

      return NextResponse.json({ 
        error: 'Failed to save resource. Please try again.' 
        }, { status: 500, headers })
    }

    // 11. Success response
    return NextResponse.json({
      success: true,
      message: 'Resource submitted successfully! It will be reviewed by administrators before publication.',
      resource: insertData
    }, { status: 201, headers })

  } catch (error: any) {
    console.error('Resource upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers }
    )
  }
}
