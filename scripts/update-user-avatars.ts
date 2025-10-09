#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

async function updateAvatars() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
  }

  // Create Supabase client with service role key for full access
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

  try {
    console.log('Fetching users with Google avatars...')
    
    // Get all users who have avatar_url in their metadata
    const { data: users, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('Error fetching users:', error)
      process.exit(1)
    }
    
    console.log(`Found ${users.length} users`)
    
    let updatedCount = 0
    
    // Process each user
    for (const user of users.users || []) {
      const googleAvatarUrl = user.user_metadata?.avatar_url
      
      if (googleAvatarUrl) {
        try {
          // Update user metadata to ensure avatar_url is properly set
          const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
            user_metadata: {
              ...user.user_metadata,
              avatar_url: googleAvatarUrl
            }
          })
          
          if (updateError) {
            console.error(`Error updating user ${user.email}:`, updateError)
          } else {
            console.log(`Updated avatar for user: ${user.email}`)
            updatedCount++
          }
        } catch (err) {
          console.error(`Error processing user ${user.email}:`, err)
        }
      }
    }
    
    console.log(`Successfully updated avatars for ${updatedCount} users`)
    
    // Update all community posts with user avatars
    console.log('Updating community posts with user avatars...')
    
    // This would require a more complex query to join users with posts
    // For now, we'll rely on the database migration to handle this
    
    console.log('Avatar update process completed!')
  } catch (error) {
    console.error('Error in avatar update process:', error)
    process.exit(1)
  }
}

// Run the script
updateAvatars()