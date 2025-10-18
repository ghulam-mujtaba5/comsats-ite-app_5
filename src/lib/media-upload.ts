import { createSupabaseClient } from '@lib/supabase-utils'

/**
 * Uploads a file to Supabase Storage
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @param folder The folder path within the bucket
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(
  file: File, 
  bucket: string = 'community-media', 
  folder: string = 'posts'
): Promise<{ url: string; thumbnailUrl?: string }> {
  try {
    const supabase = await createSupabaseClient()
    
    // Generate a unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExtension}`
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`)
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
    
    // For images, also generate a thumbnail
    let thumbnailUrl = undefined
    if (file.type.startsWith('image/')) {
      thumbnailUrl = publicUrl // In a real implementation, you'd generate a thumbnail
    }
    
    return {
      url: publicUrl,
      thumbnailUrl
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

/**
 * Uploads multiple files to Supabase Storage
 * @param files Array of files to upload
 * @param bucket The storage bucket name
 * @param folder The folder path within the bucket
 * @returns Array of uploaded file URLs
 */
export async function uploadFiles(
  files: File[], 
  bucket: string = 'community-media', 
  folder: string = 'posts'
): Promise<Array<{ url: string; thumbnailUrl?: string; type: string }>> {
  try {
    const uploadPromises = files.map(async (file) => {
      const result = await uploadFile(file, bucket, folder)
      return {
        ...result,
        type: getFileType(file)
      }
    })
    
    return await Promise.all(uploadPromises)
  } catch (error) {
    console.error('Error uploading files:', error)
    throw error
  }
}

/**
 * Determines the file type based on MIME type
 * @param file The file to analyze
 * @returns The file type
 */
function getFileType(file: File): string {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('video/')) return 'video'
  if (file.type.startsWith('audio/')) return 'audio'
  if (file.type.includes('pdf')) return 'document'
  if (file.type.includes('zip') || file.type.includes('rar')) return 'archive'
  return 'document'
}

/**
 * Deletes a file from Supabase Storage
 * @param url The public URL of the file to delete
 * @param bucket The storage bucket name
 * @returns Success status
 */
export async function deleteFile(
  url: string, 
  bucket: string = 'community-media'
): Promise<boolean> {
  try {
    const supabase = await createSupabaseClient()
    
    // Extract the file path from the URL
    const urlObj = new URL(url)
    const filePath = urlObj.pathname.split('/').slice(3).join('/') // Remove /storage/v1/object/public/
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])
    
    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`)
    }
    
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
}