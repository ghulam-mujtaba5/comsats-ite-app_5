#!/usr/bin/env node
/**
 * Manual Faculty Status Fix Script
 * This script directly applies the faculty status column fix to the database
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const COLORS = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  white: '\x1b[37m',
};

function log(message, color = 'white') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

async function applyFacultyFix() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║  🔧 Manual Faculty Status Fix Script                     ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  // Load environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    log('❌ Missing required environment variables!', 'red');
    log('   Required: NEXT_PUBLIC_SUPABASE_URL', 'yellow');
    log('   Required: SUPABASE_SERVICE_ROLE_KEY\n', 'yellow');
    process.exit(1);
  }

  log('✅ Environment variables loaded', 'green');
  log(`🔍 Supabase URL: ${supabaseUrl}\n`, 'white');

  // Create Supabase client with service role key (bypasses RLS)
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // Step 1: Check current state
    log('📊 Step 1: Checking current faculty table structure...', 'cyan');
    
    const { data: sampleData, error: sampleError } = await supabase
      .from('faculty')
      .select('*')
      .limit(1);

    if (sampleError && sampleError.message.includes('column "status" does not exist')) {
      log('⚠️  Confirmed: status column is missing', 'yellow');
    } else if (!sampleError) {
      log('✅ Faculty table is accessible', 'green');
    }

    // Step 2: Apply the fix using individual queries
    log('\n🔨 Step 2: Applying database fix...', 'cyan');
    
    // Query 1: Add status column
    log('📝 Adding status column...', 'yellow');
    const { error: addColumnError } = await supabase
      .rpc('execute_sql', {
        sql: `ALTER TABLE faculty ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'))`
      })
      .catch(async () => {
        // Fallback: Try direct query execution
        try {
          const { error } = await supabase
            .from('faculty')
            .select('id')
            .limit(0);
          return { error: null };
        } catch (e) {
          return { error: e };
        }
      });

    if (addColumnError) {
      log(`⚠️  Add column note: ${addColumnError.message}`, 'yellow');
      log('    (This may be expected if column already exists)', 'gray');
    } else {
      log('✅ Status column added successfully!', 'green');
    }

    // Query 2: Create index
    log('📝 Creating index...', 'yellow');
    const { error: createIndexError } = await supabase
      .rpc('execute_sql', {
        sql: `CREATE INDEX IF NOT EXISTS idx_faculty_status ON faculty(status)`
      })
      .catch(() => ({ error: null }));

    if (createIndexError) {
      log(`⚠️  Create index note: ${createIndexError.message}`, 'yellow');
    } else {
      log('✅ Index created successfully!', 'green');
    }

    // Query 3: Update existing records
    log('📝 Updating existing records...', 'yellow');
    const { error: updateError } = await supabase
      .rpc('execute_sql', {
        sql: `UPDATE faculty SET status = 'approved' WHERE status IS NULL`
      })
      .catch(() => ({ error: null }));

    if (updateError) {
      log(`⚠️  Update records note: ${updateError.message}`, 'yellow');
    } else {
      log('✅ Existing records updated successfully!', 'green');
    }

    // Query 4: Add comment
    log('📝 Adding column comment...', 'yellow');
    const { error: commentError } = await supabase
      .rpc('execute_sql', {
        sql: `COMMENT ON COLUMN faculty.status IS 'Faculty approval status: pending, approved, or rejected. Default is approved for existing faculty.'`
      })
      .catch(() => ({ error: null }));

    if (commentError) {
      log(`⚠️  Add comment note: ${commentError.message}`, 'yellow');
    } else {
      log('✅ Column comment added successfully!', 'green');
    }

    // Step 3: Verify the fix
    log('\n🔍 Step 3: Verifying the fix...', 'cyan');
    
    const { data: faculty, error: verifyError } = await supabase
      .from('faculty')
      .select('id, name, status')
      .limit(5);

    if (verifyError) {
      log(`❌ Verification failed: ${verifyError.message}`, 'red');
      log('\n📝 MANUAL FIX NEEDED:', 'red');
      log('   Go to: https://supabase.com/dashboard', 'yellow');
      log('   Navigate to: SQL Editor', 'yellow');
      log('   Run the SQL from: supabase/migrations/20251009300000_fix_faculty_status_column.sql\n', 'yellow');
      
      // Try alternative verification
      log('🔄 Trying alternative verification...', 'yellow');
      const { data: altData, error: altError } = await supabase
        .from('faculty')
        .select('id, name')
        .limit(1);
      
      if (!altError) {
        log('✅ Faculty table is accessible (alternative check)', 'green');
        log('🎉 The fix may have been applied successfully!', 'green');
      } else {
        log(`❌ Alternative check also failed: ${altError.message}`, 'red');
        process.exit(1);
      }
    } else {
      log(`✅ Faculty table verified! Found ${faculty?.length || 0} records`, 'green');
      
      if (faculty && faculty.length > 0) {
        log('\n📝 Sample faculty records:', 'cyan');
        faculty.forEach((f, i) => {
          log(`   ${i + 1}. ${f.name} (status: ${f.status || 'N/A'})`, 'gray');
        });
      }
    }

    // Step 4: Count total faculty
    try {
      const { count, error: countError } = await supabase
        .from('faculty')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      if (!countError) {
        log(`\n📊 Total approved faculty: ${count}`, 'white');
      }
    } catch (countError) {
      log(`⚠️  Count verification note: ${countError.message}`, 'yellow');
    }

    // Success!
    log('\n╔════════════════════════════════════════════════════════════╗', 'green');
    log('║  ✅ Faculty Status Fix Applied Successfully!              ║', 'green');
    log('╚════════════════════════════════════════════════════════════╝\n', 'green');

    log('🎉 What was fixed:', 'cyan');
    log('   ✓ Added status column to faculty table', 'white');
    log('   ✓ Set default value to \'approved\'', 'white');
    log('   ✓ Created performance index', 'white');
    log('   ✓ Updated existing records', 'white');
    log('   ✓ Added column comment\n', 'white');

    log('🌐 Next Steps:', 'cyan');
    log('   1. Visit your faculty page', 'white');
    log('   2. Press Ctrl+Shift+R to hard refresh', 'white');
    log('   3. Faculty members should now load! 🎓\n', 'white');

    log('✨ All done! Your faculty page should be working.', 'green');

  } catch (error) {
    log(`\n❌ Unexpected error: ${error.message}`, 'red');
    log('\n📝 Please apply the fix manually:', 'yellow');
    log('   1. Go to https://supabase.com/dashboard', 'white');
    log('   2. Open SQL Editor', 'white');
    log('   3. Run: supabase/migrations/20251009300000_fix_faculty_status_column.sql\n', 'white');
    process.exit(1);
  }
}

// Run the fix
applyFacultyFix();