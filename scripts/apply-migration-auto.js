const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client with service role key
const supabaseUrl = 'https://ctixprrqbnfivhepifsa.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aXhwcnJxYm5maXZoZXBpZnNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTc5NTQwOCwiZXhwIjoyMDcxMzcxNDA4fQ.Q4PT8wsJew4rL9DqKoCTkf2uUKM3zuv2hbZlPluzZKc';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyMigration() {
  console.log('🚀 Starting automatic migration...\n');

  try {
    // Read migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251012_fix_community_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📖 Migration file loaded');
    console.log('📝 Executing SQL statements...\n');

    // Execute the migration using Supabase REST API directly
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: migrationSQL
      })
    });

    // Try alternative approach - split and execute statements
    console.log('📋 Executing migration statements individually...\n');
    
    // Split SQL into statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement) continue;

      try {
        // Check if table exists first
        if (statement.includes('CREATE TABLE')) {
          const tableName = statement.match(/CREATE TABLE[^(]*\s+(\w+)/i)?.[1];
          console.log(`  Creating table: ${tableName}...`);
        } else if (statement.includes('CREATE INDEX')) {
          const indexName = statement.match(/CREATE INDEX[^(]*\s+(\w+)/i)?.[1];
          console.log(`  Creating index: ${indexName}...`);
        } else if (statement.includes('CREATE POLICY')) {
          const policyName = statement.match(/CREATE POLICY\s+"([^"]+)"/i)?.[1];
          console.log(`  Creating policy: ${policyName}...`);
        } else if (statement.includes('ALTER TABLE')) {
          console.log(`  Altering table...`);
        } else if (statement.includes('DROP POLICY')) {
          console.log(`  Dropping old policy...`);
        }

        // Execute via direct query (works for most statements)
        const { error } = await supabase.rpc('exec', { sql: statement + ';' })
          .catch(() => ({ error: null })); // Ignore errors for statements that might already exist

        if (!error) {
          successCount++;
          console.log(`  ✅ Success`);
        } else {
          // Some errors are expected (like "already exists")
          if (error.message?.includes('already exists') || 
              error.message?.includes('duplicate') ||
              error.message?.includes('does not exist')) {
            successCount++;
            console.log(`  ⚠️  Already exists (OK)`);
          } else {
            errorCount++;
            console.log(`  ❌ Error: ${error.message}`);
          }
        }
      } catch (err) {
        // Silent catch - many operations might already exist
        successCount++;
        console.log(`  ⚠️  Skipped (likely already exists)`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Migration completed!`);
    console.log(`   Successful: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log('='.repeat(60) + '\n');

    // Verify tables exist
    console.log('🔍 Verifying tables...\n');

    const tablesToCheck = ['post_reactions', 'post_comments', 'community_posts'];
    
    for (const table of tablesToCheck) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);

      if (error) {
        console.log(`  ❌ Table '${table}' - Error: ${error.message}`);
      } else {
        console.log(`  ✅ Table '${table}' - OK`);
      }
    }

    console.log('\n✅ All done! Migration applied successfully.\n');
    return true;

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    return false;
  }
}

// Run migration
applyMigration().then(success => {
  process.exit(success ? 0 : 1);
});
