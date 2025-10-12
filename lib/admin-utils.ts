import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Verify if the current user is an admin
 * @param supabase - Supabase client instance
 * @returns boolean indicating if user is admin
 */
export async function verifyAdmin(supabase: ReturnType<typeof createServerClient>) {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    // Check if user exists in admin_users table
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('user_id', user.id)
      .single()

    if (error || !adminUser) {
      return false
    }

    // User is an admin if they exist in the admin_users table
    return true
  } catch (error) {
    console.error('Error verifying admin:', error)
    return false
  }
}