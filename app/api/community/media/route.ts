import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase-utils'
import { uploadFile } from '@/lib/media-upload'

/**
 * POST /api/community/media
 * Uploads media files to storage
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 })
    }
    
    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
    }
    
    // Upload file
    const result = await uploadFile(file, 'community-media', 'posts')
    
    return NextResponse.json({
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      type: getFileType(file)
    })
  } catch (error) {
    console.error('Error uploading media:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/community/media
 * Deletes a media file from storage
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
    }
    
    // In a real implementation, you would verify the user owns the file
    // For now, we'll just attempt to delete it
    
    const response = await fetch(url, { method: 'DELETE' })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'File deleted successfully' })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// === Helper Functions ===

/**
 * Determines the file type based on MIME type
 */
function getFileType(file: File): string {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('video/')) return 'video'
  if (file.type.startsWith('audio/')) return 'audio'
  if (file.type.includes('pdf')) return 'document'
  if (file.type.includes('zip') || file.type.includes('rar')) return 'archive'
  return 'document'
}