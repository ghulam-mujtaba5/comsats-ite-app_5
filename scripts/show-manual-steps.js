const https = require('https');

const supabaseUrl = 'https://ctixprrqbnfivhepifsa.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aXhwcnJxYm5maXZoZXBpZnNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTc5NTQwOCwiZXhwIjoyMDcxMzcxNDA4fQ.Q4PT8wsJew4rL9DqKoCTkf2uUKM3zuv2hbZlPluzZKc';

async function createTablesManually() {
  console.log('🚀 Creating missing tables manually...\n');

  const statements = [
    {
      name: 'post_reactions table',
      sql: `CREATE TABLE IF NOT EXISTS post_reactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        reaction_type VARCHAR(20) DEFAULT 'like',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(post_id, user_id, reaction_type)
      )`
    },
    {
      name: 'post_comments table',
      sql: `CREATE TABLE IF NOT EXISTS post_comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
        likes_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`
    },
    {
      name: 'post_reactions index (post_id)',
      sql: 'CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON post_reactions(post_id)'
    },
    {
      name: 'post_reactions index (user_id)',
      sql: 'CREATE INDEX IF NOT EXISTS idx_post_reactions_user_id ON post_reactions(user_id)'
    },
    {
      name: 'post_comments index (post_id)',
      sql: 'CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id)'
    },
    {
      name: 'post_comments index (user_id)',
      sql: 'CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id)'
    }
  ];

  console.log('📝 Creating tables and indexes...\n');

  for (const { name, sql } of statements) {
    console.log(`  Creating: ${name}...`);
    console.log(`  SQL: ${sql.substring(0, 80)}...`);
    console.log(`  ⚠️  Note: Tables must be created via Supabase Dashboard SQL Editor`);
  }

  console.log('\n' + '='.repeat(70));
  console.log('📋 MANUAL STEPS REQUIRED:');
  console.log('='.repeat(70));
  console.log('\n1. Open Supabase Dashboard:');
  console.log('   https://supabase.com/dashboard/project/ctixprrqbnfivhepifsa\n');
  console.log('2. Click "SQL Editor" in left sidebar\n');
  console.log('3. Click "New Query"\n');
  console.log('4. Copy this SQL:\n');
  console.log('----------------------------------------');
  console.log(`
-- Create post_reactions table
CREATE TABLE IF NOT EXISTS post_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type VARCHAR(20) DEFAULT 'like',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id, reaction_type)
);

-- Create post_comments table
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_user_id ON post_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);

-- Enable RLS
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for post_reactions
CREATE POLICY "Anyone can view reactions" ON post_reactions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reactions" ON post_reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" ON post_reactions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for post_comments
CREATE POLICY "Anyone can view comments" ON post_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON post_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON post_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON post_comments
  FOR DELETE USING (auth.uid() = user_id);
`);
  console.log('----------------------------------------\n');
  console.log('5. Click "Run" button\n');
  console.log('6. Wait for "Success" message\n');
  console.log('7. Run verification: node scripts/verify.js\n');
  console.log('='.repeat(70));
}

createTablesManually();
