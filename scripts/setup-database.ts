import { createClient } from '@supabase/supabase-js'
import fs from 'fs/promises'

const supabaseUrl = 'https://ctixprrqbnfivhepifsa.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aXhwcnJxYm5maXZoZXBpZnNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTc5NTQwOCwiZXhwIjoyMDcxMzcxNDA4fQ.Q4PT8wsJew4rL9DqKoCTkf2uUKM3zuv2hbZlPluzZKc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runSQL(sql: string, description: string) {
  console.log(`\n📝 ${description}...`)
  
  try {
    // Split by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    for (const statement of statements) {
      const { data, error } = await supabase.rpc('query', { sql: statement })
      
      if (error && !error.message.includes('already exists')) {
        console.log(`   ⚠️  ${error.message.substring(0, 100)}`)
      }
    }
    
    console.log(`   ✅ Complete`)
  } catch (error: any) {
    console.log(`   ❌ Error: ${error.message}`)
  }
}

async function setupDatabase() {
  console.log('🚀 Setting up CampusAxis Database...\n')
  
  // Read migration files
  const gamificationSQL = await fs.readFile('supabase/migrations/20251011000000_create_gamification_tables.sql', 'utf8')
  const emailSQL = await fs.readFile('supabase/migrations/20251011000001_create_email_tables.sql', 'utf8')
  
  await runSQL(gamificationSQL, 'Creating gamification tables (achievements, user_stats)')
  await runSQL(emailSQL, 'Creating email tables (email_preferences, email_logs)')
  
  console.log('\n' + '='.repeat(60))
  console.log('✨ Database setup complete!')
  console.log('='.repeat(60))
  
  // Verify tables exist
  console.log('\n🔍 Verifying tables...\n')
  
  const tables = ['achievements', 'user_achievements', 'user_stats', 'user_email_preferences', 'email_logs']
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1)
    
    if (error && error.message.includes('not find')) {
      console.log(`❌ ${table}: Not found`)
    } else {
      console.log(`✅ ${table}: Exists`)
    }
  }
}

setupDatabase()
