#!/usr/bin/env node
/**
 * Simple Faculty Status Fix Script
 * This script directly applies the faculty status column fix to the database
 */

require('dotenv').config({ path: '.env.local' });

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
  log('║  🔧 Simple Faculty Status Fix Script                     ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  log('📝 Please apply the following SQL manually:', 'yellow');
  log('   1. Go to https://supabase.com/dashboard', 'white');
  log('   2. Open SQL Editor', 'white');
  log('   3. Run the following SQL queries:\n', 'white');
  
  const sqlQueries = [
    "-- Add status column to faculty table",
    "ALTER TABLE faculty ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));",
    "",
    "-- Create index for better query performance",
    "CREATE INDEX IF NOT EXISTS idx_faculty_status ON faculty(status);",
    "",
    "-- Add helpful comment",
    "COMMENT ON COLUMN faculty.status IS 'Faculty approval status: pending, approved, or rejected. Default is approved for existing faculty.';",
    "",
    "-- Update any existing NULL values to approved",
    "UPDATE faculty SET status = 'approved' WHERE status IS NULL;",
    "",
    "-- Create RLS policy to show only approved faculty to public",
    "DROP POLICY IF EXISTS \"Allow public read access to approved faculty\" ON faculty;",
    "",
    "CREATE POLICY \"Allow public read access to approved faculty\"",
    "ON faculty FOR SELECT",
    "USING (status = 'approved');"
  ];
  
  sqlQueries.forEach(query => {
    if (query.trim() !== "") {
      log(query, 'gray');
    } else {
      log("");
    }
  });
  
  log('\n✨ After running these queries, your faculty page should work correctly!', 'green');
}

// Run the fix
applyFacultyFix();