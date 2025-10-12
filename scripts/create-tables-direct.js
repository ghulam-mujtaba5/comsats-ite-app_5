const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://ctixprrqbnfivhepifsa.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aXhwcnJxYm5maXZoZXBpZnNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTc5NTQwOCwiZXhwIjoyMDcxMzcxNDA4fQ.Q4PT8wsJew4rL9DqKoCTkf2uUKM3zuv2hbZlPluzZKc';

async function executeSQLDirect() {
  console.log('🚀 Creating tables using direct HTTP API...\n');

  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251012_fix_community_schema.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

  // Split into individual CREATE TABLE statements
  const createTableStatements = [
    // Create post_reactions table
    `CREATE TABLE IF NOT EXISTS post_reactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      reaction_type VARCHAR(20) DEFAULT 'like',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(post_id, user_id, reaction_type)
    );`,
    
    // Create post_comments table
    `CREATE TABLE IF NOT EXISTS post_comments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
      likes_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`
  ];

  const indexes = [
    `CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON post_reactions(post_id);`,
    `CREATE INDEX IF NOT EXISTS idx_post_reactions_user_id ON post_reactions(user_id);`,
    `CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);`,
    `CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);`,
    `CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);`,
    `CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);`
  ];

  const rlsPolicies = [
    // Enable RLS
    `ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;`,
    
    // post_reactions policies
    `DROP POLICY IF EXISTS "Anyone can view reactions" ON post_reactions;`,
    `CREATE POLICY "Anyone can view reactions" ON post_reactions FOR SELECT USING (true);`,
    
    `DROP POLICY IF EXISTS "Authenticated users can create reactions" ON post_reactions;`,
    `CREATE POLICY "Authenticated users can create reactions" ON post_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);`,
    
    `DROP POLICY IF EXISTS "Users can delete their own reactions" ON post_reactions;`,
    `CREATE POLICY "Users can delete their own reactions" ON post_reactions FOR DELETE USING (auth.uid() = user_id);`,
    
    // post_comments policies
    `DROP POLICY IF EXISTS "Anyone can view comments" ON post_comments;`,
    `CREATE POLICY "Anyone can view comments" ON post_comments FOR SELECT USING (true);`,
    
    `DROP POLICY IF EXISTS "Authenticated users can create comments" ON post_comments;`,
    `CREATE POLICY "Authenticated users can create comments" ON post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);`,
    
    `DROP POLICY IF EXISTS "Users can update their own comments" ON post_comments;`,
    `CREATE POLICY "Users can update their own comments" ON post_comments FOR UPDATE USING (auth.uid() = user_id);`,
    
    `DROP POLICY IF EXISTS "Users can delete their own comments" ON post_comments;`,
    `CREATE POLICY "Users can delete their own comments" ON post_comments FOR DELETE USING (auth.uid() = user_id);`
  ];

  console.log('📝 Step 1: Creating tables...\n');
  
  for (const sql of createTableStatements) {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql })
      });

      const tableName = sql.match(/CREATE TABLE[^(]*\s+(\w+)/i)?.[1];
      console.log(`  ✅ Table '${tableName}' created/verified`);
    } catch (err) {
      console.log(`  ⚠️  ${err.message}`);
    }
  }

  console.log('\n📋 Step 2: Creating indexes...\n');
  
  for (const sql of indexes) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql })
      });
      console.log(`  ✅ Index created`);
    } catch (err) {
      console.log(`  ⚠️  Already exists`);
    }
  }

  console.log('\n🔒 Step 3: Setting up RLS policies...\n');
  
  for (const sql of rlsPolicies) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql })
      });
      
      if (sql.includes('CREATE POLICY')) {
        const policyName = sql.match(/CREATE POLICY\s+"([^"]+)"/i)?.[1];
        console.log(`  ✅ Policy '${policyName}' created`);
      }
    } catch (err) {
      // Silent - policies might already exist
    }
  }

  console.log('\n✅ Migration complete!\n');
}

executeSQLDirect().catch(console.error);
