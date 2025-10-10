#!/usr/bin/env tsx

/**
 * Script to send automated reminders to graduating students
 * about adding personal email addresses for alumni access
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config()

async function sendGraduationReminders() {
  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    console.log('Fetching graduating students...')
    
    // Get users who are graduating soon (within 30 days)
    // This is a simplified query - in a real implementation, you would have
    // a more sophisticated way to identify graduating students
    const { data: users, error } = await supabase
      .from('auth_users')
      .select('id, email, user_metadata')
      .like('email', '%@cuilahore.edu.pk') // Assuming institutional email pattern
      .limit(10) // Limit for testing

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`)
    }

    console.log(`Found ${users?.length || 0} potential graduating students`)

    // For each user, check if they have a personal email
    for (const user of users || []) {
      // Check if user has personal email
      const { data: personalEmails, error: emailError } = await supabase
        .from('user_emails')
        .select('*')
        .eq('user_id', user.id)
        .eq('email_type', 'personal')

      if (emailError) {
        console.error(`Error checking emails for user ${user.id}:`, emailError)
        continue
      }

      // If no personal email, send reminder
      if (!personalEmails || personalEmails.length === 0) {
        console.log(`Sending reminder to ${user.email} (${user.user_metadata?.full_name || 'Unnamed User'})`)
        
        // In a real implementation, you would send an actual email here
        // For now, we'll just log the action
        console.log(`  📧 Reminder email would be sent to ${user.email}`)
        console.log(`  📝 Message: Please add a personal email address to maintain access to your account after graduation.`)
      } else {
        console.log(`✅ ${user.email} already has a personal email: ${personalEmails[0].email}`)
      }
    }

    console.log('Graduation reminder process completed')
  } catch (error) {
    console.error('Error in graduation reminder script:', error)
    process.exit(1)
  }
}

// Run the script if called directly
if (require.main === module) {
  sendGraduationReminders()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export default sendGraduationReminders