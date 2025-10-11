import { createClient } from '@supabase/supabase-js'

// Remote Supabase credentials
const supabaseUrl = 'https://ctixprrqbnfivhepifsa.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aXhwcnJxYm5maXZoZXBpZnNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTc5NTQwOCwiZXhwIjoyMDcxMzcxNDA4fQ.Q4PT8wsJew4rL9DqKoCTkf2uUKM3zuv2hbZlPluzZKc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verifySetup() {
  console.log('🔍 Verifying CampusAxis Setup...\n')

  try {
    // 1. Check achievements table
    console.log('1️⃣ Checking achievements table...')
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('id, title, category')
      .limit(5)

    if (achievementsError) {
      console.log('❌ Achievements table error:', achievementsError.message)
    } else {
      console.log(`✅ Achievements table exists with ${achievements?.length || 0} sample records`)
      if (achievements && achievements.length > 0) {
        achievements.forEach(a => console.log(`   - ${a.title} (${a.category})`))
      }
    }

    // 2. Check user_stats table
    console.log('\n2️⃣ Checking user_stats table...')
    const { data: stats, error: statsError } = await supabase
      .from('user_stats')
      .select('user_id, total_points, level')
      .limit(1)

    if (statsError) {
      console.log('❌ User stats table error:', statsError.message)
    } else {
      console.log('✅ User stats table exists')
    }

    // 3. Check user_email_preferences table
    console.log('\n3️⃣ Checking user_email_preferences table...')
    const { data: prefs, error: prefsError } = await supabase
      .from('user_email_preferences')
      .select('user_id, email_achievements')
      .limit(1)

    if (prefsError) {
      console.log('❌ Email preferences table error:', prefsError.message)
    } else {
      console.log('✅ Email preferences table exists')
    }

    // 4. Check email_logs table
    console.log('\n4️⃣ Checking email_logs table...')
    const { data: logs, error: logsError } = await supabase
      .from('email_logs')
      .select('id, email_type, status')
      .limit(1)

    if (logsError) {
      console.log('❌ Email logs table error:', logsError.message)
    } else {
      console.log('✅ Email logs table exists')
    }

    // 5. Check storage buckets
    console.log('\n5️⃣ Checking storage buckets...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.log('❌ Storage buckets error:', bucketsError.message)
    } else {
      console.log(`✅ Found ${buckets?.length || 0} storage buckets`)
      if (buckets) {
        buckets.forEach(b => console.log(`   - ${b.name} (${b.public ? 'public' : 'private'})`))
      }
      
      const hasResourcesBucket = buckets?.some(b => b.name === 'resources')
      if (!hasResourcesBucket) {
        console.log('\n⚠️  WARNING: "resources" bucket not found!')
        console.log('   Create it in Supabase Dashboard → Storage → New Bucket')
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('✨ Setup verification complete!')
    console.log('='.repeat(60))

  } catch (error) {
    console.error('\n❌ Verification failed:', error)
  }
}

verifySetup()
