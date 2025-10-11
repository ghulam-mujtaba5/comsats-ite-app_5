import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Use service role key for admin access
const supabaseUrl = 'https://ctixprrqbnfivhepifsa.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aXhwcnJxYm5maXZoZXBpZnNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTc5NTQwOCwiZXhwIjoyMDcxMzcxNDA4fQ.Q4PT8wsJew4rL9DqKoCTkf2uUKM3zuv2hbZlPluzZKc'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function executeSQLFile(filePath: string) {
  const fileName = path.basename(filePath)
  console.log(`\n📄 Executing: ${fileName}...`)
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8')
    
    // Execute using rpc call to pg_exec
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })
    
    if (error) {
      console.log(`❌ Error in ${fileName}:`, error.message)
      return false
    }
    
    console.log(`✅ ${fileName} executed successfully`)
    return true
  } catch (error: any) {
    console.error(`❌ Failed to read or execute ${fileName}:`, error.message)
    return false
  }
}

async function applyMigrations() {
  console.log('🚀 Applying CampusAxis Migrations...\n')
  
  const migrationsDir = 'supabase/migrations'
  const migrationFiles = [
    '20251011000000_create_gamification_tables.sql',
    '20251011000001_create_email_tables.sql',
  ]
  
  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file)
    if (fs.existsSync(filePath)) {
      await executeSQLFile(filePath)
    } else {
      console.log(`⚠️  File not found: ${file}`)
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('✨ Migration process complete!')
  console.log('='.repeat(60))
}

applyMigrations()
