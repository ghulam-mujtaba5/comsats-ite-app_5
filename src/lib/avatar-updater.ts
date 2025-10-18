import { createClient } from '@supabase/supabase-js'

/**
 * Update user avatar URL in their metadata
 * This function should be called when a user logs in to ensure their avatar is up to date
 * @param user The authenticated user object
 * @param supabase The Supabase client instance
 */
export async function updateUserAvatar(user: any, supabase: any) {
  try {
    // Check if user has an avatar URL in their metadata from Google OAuth
    const googleAvatarUrl = user.user_metadata?.avatar_url
    
    // If we have a Google avatar URL, update the user's metadata
    if (googleAvatarUrl) {
      // Check if the avatar URL has changed
      const currentAvatarUrl = user.user_metadata?.avatar_url
      
      if (googleAvatarUrl !== currentAvatarUrl) {
        // Update user metadata with the new avatar URL
        const { error } = await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            avatar_url: googleAvatarUrl
          }
        })
        
        if (error) {
          console.error('Failed to update user avatar:', error)
          return false
        }
        
        console.log('User avatar updated successfully')
        return true
      }
      // Even if URLs are the same, we should return true to indicate success
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error in updateUserAvatar:', error)
    return false
  }
}

/**
 * Ensure user avatar is properly set for community posts
 * This function updates existing posts with the user's current avatar
 * @param userId The user's ID
 * @param supabase The Supabase client instance
 */
export async function updateUserAvatarInPosts(userId: string, supabase: any) {
  try {
    // Validate userId before proceeding
    if (!userId) {
      console.warn('No userId provided to updateUserAvatarInPosts')
      return false
    }

    // Get the user's current avatar URL with error handling
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.warn('Failed to get user for avatar update:', userError.message)
      return false
    }
    
    if (!user) {
      console.warn('No user found for avatar update')
      return false
    }

    // Validate avatar URL or use default
    const avatarUrl = user?.user_metadata?.avatar_url || '/student-avatar.png'
    
    // Validate avatar URL format (basic check)
    if (avatarUrl && typeof avatarUrl === 'string' && avatarUrl.length > 0) {
      // Update all posts by this user with their current avatar
      const { error: updateError } = await supabase
        .from('community_posts')
        .update({ avatar_url: avatarUrl })
        .eq('user_id', userId)
      
      if (updateError) {
        // Only log warning instead of error to avoid console pollution
        console.warn('Could not update user posts with avatar:', updateError.message)
        return false
      }
      
      return true
    } else {
      console.warn('Invalid avatar URL format')
      return false
    }
  } catch (error) {
    // Silently handle errors to avoid console pollution
    console.warn('Error in updateUserAvatarInPosts:', error instanceof Error ? error.message : 'Unknown error')
    return false
  }
}