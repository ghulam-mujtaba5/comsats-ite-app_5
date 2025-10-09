#!/usr/bin/env tsx
import { execSync } from 'child_process'
import { existsSync, writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

// Check if Supabase CLI is installed
try {
  execSync('npx supabase --version', { stdio: 'pipe' })
  console.log('✅ Supabase CLI is available')
} catch (error) {
  console.log('❌ Supabase CLI not found. Installing...')
  try {
    execSync('npm install -g supabase', { stdio: 'inherit' })
    console.log('✅ Supabase CLI installed successfully')
  } catch (installError) {
    console.error('❌ Failed to install Supabase CLI')
    process.exit(1)
  }
}

// Check if Supabase project is linked
const supabaseDir = join(process.cwd(), 'supabase')
if (!existsSync(supabaseDir)) {
  console.log('📁 Creating supabase directory...')
  execSync('mkdir -p supabase', { stdio: 'inherit' })
}

// Check if .env file exists
const envPath = join(process.cwd(), '.env')
if (!existsSync(envPath)) {
  console.log('📝 Creating .env file with Supabase configuration...')
  
  // Try to get Supabase config from existing files or environment
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('⚠️  Supabase credentials not found in environment')
    console.log('Please add the following to your .env file:')
    console.log('')
    console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
    console.log('SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key')
    console.log('')
    
    // Create template .env file
    const envTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Development Configuration
NODE_ENV=development
`
    writeFileSync(envPath, envTemplate)
  }
}

// Check if migrations directory exists
const migrationsDir = join(supabaseDir, 'migrations')
if (!existsSync(migrationsDir)) {
  console.log('📁 Creating migrations directory...')
  execSync('mkdir -p supabase/migrations', { stdio: 'inherit' })
}

// Create a basic migration for polls if it doesn't exist
const pollsMigrationPath = join(migrationsDir, '20251009310000_add_polls_feature.sql')
if (!existsSync(pollsMigrationPath)) {
  console.log('📝 Creating polls migration file...')
  
  const pollsMigration = `-- Add polls feature to the community platform
-- This will allow users to create and participate in polls

-- Polls table
CREATE TABLE IF NOT EXISTS community_polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    options TEXT[] NOT NULL, -- Array of poll options
    votes INTEGER[] DEFAULT '{}', -- Array of vote counts for each option
    allow_multiple BOOLEAN DEFAULT false, -- Whether users can select multiple options
    expires_at TIMESTAMPTZ, -- When the poll expires (null for no expiration)
    is_active BOOLEAN DEFAULT true, -- Whether the poll is currently active
    campus_id UUID REFERENCES campuses(id),
    department_id UUID REFERENCES departments(id),
    batch TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Poll votes table (to track who voted for what)
CREATE TABLE IF NOT EXISTS community_poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID REFERENCES community_polls(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    option_indices INTEGER[] NOT NULL, -- Array of selected option indices
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(poll_id, user_id) -- Each user can vote only once per poll
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_polls_user_id ON community_polls(user_id);
CREATE INDEX IF NOT EXISTS idx_community_polls_campus_id ON community_polls(campus_id);
CREATE INDEX IF NOT EXISTS idx_community_polls_department_id ON community_polls(department_id);
CREATE INDEX IF NOT EXISTS idx_community_polls_batch ON community_polls(batch);
CREATE INDEX IF NOT EXISTS idx_community_polls_active ON community_polls(is_active);
CREATE INDEX IF NOT EXISTS idx_community_polls_expires_at ON community_polls(expires_at);
CREATE INDEX IF NOT EXISTS idx_community_poll_votes_poll_id ON community_poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_community_poll_votes_user_id ON community_poll_votes(user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_polls_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS community_polls_updated_at ON community_polls;
CREATE TRIGGER community_polls_updated_at 
BEFORE UPDATE ON community_polls 
FOR EACH ROW EXECUTE FUNCTION update_polls_timestamp();

-- RLS Policies
ALTER TABLE community_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_poll_votes ENABLE ROW LEVEL SECURITY;

-- Users can view active polls
CREATE POLICY "Public can view active polls" ON community_polls 
FOR SELECT TO public 
USING (is_active = true);

-- Authenticated users can create polls
CREATE POLICY "Authenticated can create polls" ON community_polls 
FOR INSERT TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Users can update/delete their own polls
CREATE POLICY "Users can update own polls" ON community_polls 
FOR UPDATE TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own polls" ON community_polls 
FOR DELETE TO authenticated 
USING (user_id = auth.uid());

-- Authenticated users can vote in polls
CREATE POLICY "Authenticated can vote in polls" ON community_poll_votes 
FOR INSERT TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Users can view poll votes (for results)
CREATE POLICY "Public can view poll votes" ON community_poll_votes 
FOR SELECT TO public 
USING (true);

COMMENT ON TABLE community_polls IS 'Community polls for student engagement';
COMMENT ON TABLE community_poll_votes IS 'User votes for community polls';
`
  
  writeFileSync(pollsMigrationPath, pollsMigration)
  console.log('✅ Polls migration created')
}

// Check if functions directory exists
const functionsDir = join(supabaseDir, 'functions')
if (!existsSync(functionsDir)) {
  console.log('📁 Creating functions directory...')
  execSync('mkdir -p supabase/functions', { stdio: 'inherit' })
}

// Check if config file exists
const configPath = join(supabaseDir, 'config.toml')
if (!existsSync(configPath)) {
  console.log('📝 Creating Supabase config file...')
  const configTemplate = `# Supabase CLI configuration
project_id = "campusaxis"

[database]
port = 54322

[auth]
enabled = true
image = "supabase/auth:v2.187.2"
port = 54321

[auth.email]
enable_signup = true
enable_confirmations = false

[auth.sms]
enable_signup = false

default_role = "authenticated"
jwt_expiry = 3600
jwt_secret = "super-secret-jwt-token-with-at-least-32-characters-long"

[storage]
enabled = true
image = "supabase/storage-api:v1.14.5"
port = 54323

[realtime]
enabled = true
image = "supabase/realtime:v2.34.7"
port = 54324

[studio]
enabled = true
image = "supabase/studio:v0.31.12"
port = 54325

[functions]
enabled = true

[inbucket]
enabled = true
port = 54326

default_password = "super-secret-password"

default_email = "admin@campusaxis.com"
`
  writeFileSync(configPath, configTemplate)
}

console.log('✅ Supabase CLI setup completed!')
console.log('')
console.log('To use Supabase CLI commands, run:')
console.log('  npx supabase status')
console.log('  npx supabase start')
console.log('  npx supabase stop')
console.log('  npx supabase db reset')
console.log('  npx supabase gen types typescript --local > lib/database.types.ts')
console.log('  npx supabase functions serve')
console.log('')
console.log('For development workflow:')
console.log('  1. npx supabase start')
console.log('  2. npx supabase db reset')
console.log('  3. npm run dev')
console.log('')