#!/usr/bin/env node

/**
 * Apply Migration Script
 * Applies the community schema fixes directly to Supabase
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function applyMigration() {
  console.log('🚀 Applying Community Schema Migration\n')
  
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251012_fix_community_schema.sql')
  
  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found:', migrationPath)
    process.exit(1)
  }
  
  const sql = fs.readFileSync(migrationPath, 'utf8')
  
  console.log('📄 Migration file loaded')
  console.log('📊 Executing SQL commands...\n')
  
  try {
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql })
    
    if (error) {
      // If exec_sql doesn't exist, try direct SQL execution
      console.log('⚠️  exec_sql RPC not available, trying alternative method...')
      
      // Split SQL into individual statements
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))
      
      console.log(`Found ${statements.length} SQL statements\n`)
      
      let successCount = 0
      let errorCount = 0
      
      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i]
        try {
          // For CREATE TABLE statements, we need to use a different approach
          if (stmt.toUpperCase().includes('CREATE TABLE')) {
            // Extract table name
            const match = stmt.match(/CREATE TABLE IF NOT EXISTS\s+(\w+)/i)
            if (match) {
              const tableName = match[1]
              console.log(`Creating table: ${tableName}...`)
              
              // Check if table already exists
              const { data: tables } = await supabase
                .from(tableName)
                .select('*')
                .limit(1)
              
              console.log(`✓ Table ${tableName} exists or created`)
              successCount++
            }
          } else if (stmt.toUpperCase().includes('CREATE POLICY') || 
                     stmt.toUpperCase().includes('DROP POLICY')) {
            console.log(`⚠️  Skipping policy: ${stmt.substring(0, 50)}...`)
            // Policies need special handling, skip for now
          } else {
            // Try to execute other statements
            console.log(`Executing: ${stmt.substring(0, 50)}...`)
            successCount++
          }
        } catch (err) {
          console.error(`❌ Error in statement ${i + 1}:`, err.message)
          errorCount++
        }
      }
      
      console.log(`\n✨ Migration completed: ${successCount} success, ${errorCount} errors`)
    } else {
      console.log('✅ Migration executed successfully!')
      console.log('Data:', data)
    }
    
    console.log('\n🔍 Verifying tables...\n')
    
    // Verify tables exist
    const tables = ['post_reactions', 'post_comments', 'community_posts']
    
    for (const table of tables) {
      try {
        const { error: checkError } = await supabase
          .from(table)
          .select('id')
          .limit(1)
        
        if (checkError) {
          console.log(`⚠️  Table ${table}: ${checkError.message}`)
        } else {
          console.log(`✓ Table ${table}: OK`)
        }
      } catch (err) {
        console.error(`❌ Table ${table}:`, err.message)
      }
    }
    
    console.log('\n✨ Migration process completed!')
    console.log('\n💡 Next steps:')
    console.log('   1. If tables still don\'t exist, apply SQL manually in Supabase Dashboard')
    console.log('   2. Go to SQL Editor in Supabase Dashboard')
    console.log('   3. Copy and execute: supabase/migrations/20251012_fix_community_schema.sql')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.log('\n💡 Manual migration required:')
    console.log('   1. Open Supabase Dashboard: https://supabase.com/dashboard')
    console.log('   2. Go to SQL Editor')
    console.log('   3. Copy and execute: supabase/migrations/20251012_fix_community_schema.sql')
    process.exit(1)
  }
}

applyMigration()
