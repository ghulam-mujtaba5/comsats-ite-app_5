-- ============================================================================
-- CAMPUSAXIS - COMPLETE DATABASE SETUP
-- Run this file in Supabase Dashboard SQL Editor
-- ============================================================================

-- ============================================================================
-- PART 1: GAMIFICATION TABLES
-- ============================================================================

-- 1. Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  category TEXT NOT NULL CHECK (category IN ('participation', 'contribution', 'exploration', 'milestone', 'special')),
  criteria JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 3. User Stats Table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  posts_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  likes_received INTEGER DEFAULT 0,
  likes_given INTEGER DEFAULT 0,
  resources_uploaded INTEGER DEFAULT 0,
  papers_uploaded INTEGER DEFAULT 0,
  groups_joined INTEGER DEFAULT 0,
  events_attended INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  achievements_unlocked INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Gamification
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_rarity ON achievements(rarity);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_total_points ON user_stats(total_points DESC);

-- RLS Policies for Gamification
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Achievements are viewable by everyone" ON achievements FOR SELECT USING (true);
CREATE POLICY "User achievements are viewable by everyone" ON user_achievements FOR SELECT USING (true);
CREATE POLICY "User stats are viewable by everyone" ON user_stats FOR SELECT USING (true);
CREATE POLICY "Users can update their own stats" ON user_stats FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- PART 2: EMAIL SYSTEM TABLES
-- ============================================================================

-- 1. User Email Preferences Table
CREATE TABLE IF NOT EXISTS user_email_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_achievements BOOLEAN DEFAULT TRUE,
  email_comments BOOLEAN DEFAULT TRUE,
  email_likes BOOLEAN DEFAULT TRUE,
  email_weekly_digest BOOLEAN DEFAULT TRUE,
  email_resource_approved BOOLEAN DEFAULT TRUE,
  email_welcome BOOLEAN DEFAULT TRUE,
  email_marketing BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Email Logs Table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Email System
CREATE INDEX IF NOT EXISTS idx_email_preferences_user_id ON user_email_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);

-- RLS Policies for Email System
ALTER TABLE user_email_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email preferences" ON user_email_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own email preferences" ON user_email_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own email preferences" ON user_email_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own email logs" ON email_logs FOR SELECT USING (auth.uid() = user_id);

-- Trigger to auto-create email preferences
CREATE OR REPLACE FUNCTION create_user_email_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_email_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_email_prefs ON auth.users;
CREATE TRIGGER on_auth_user_created_email_prefs
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_email_preferences();

-- ============================================================================
-- PART 3: SEED ACHIEVEMENTS DATA (24 Achievements)
-- ============================================================================

INSERT INTO achievements (title, description, icon, points, rarity, category, criteria) VALUES
-- Participation (5 achievements)
('First Steps', 'Complete your profile', '🎉', 50, 'common', 'participation', '{"profile_complete": true}'),
('Social Butterfly', 'Join your first group', '🦋', 75, 'common', 'participation', '{"groups_joined": 1}'),
('Early Bird', 'Attend your first event', '🌅', 75, 'common', 'participation', '{"events_attended": 1}'),
('Regular Visitor', 'Log in 7 days in a row', '📅', 100, 'uncommon', 'participation', '{"streak_days": 7}'),
('Dedicated Student', 'Log in 30 days in a row', '🏆', 200, 'rare', 'participation', '{"streak_days": 30}'),

-- Contribution (5 achievements)
('First Post', 'Create your first post', '📝', 50, 'common', 'contribution', '{"posts_count": 1}'),
('Conversation Starter', 'Create 10 posts', '💬', 150, 'uncommon', 'contribution', '{"posts_count": 10}'),
('Helpful Hand', 'Upload your first resource', '📚', 100, 'uncommon', 'contribution', '{"resources_uploaded": 1}'),
('Resource Hero', 'Upload 10 resources', '⭐', 300, 'rare', 'contribution', '{"resources_uploaded": 10}'),
('Community Champion', 'Create 50 posts', '🏅', 500, 'epic', 'contribution', '{"posts_count": 50}'),

-- Exploration (5 achievements)
('Curious Mind', 'Visit 5 different pages', '🔍', 50, 'common', 'exploration', '{"pages_visited": 5}'),
('Explorer', 'Visit all major sections', '🗺️', 150, 'uncommon', 'exploration', '{"sections_visited": 10}'),
('Knowledge Seeker', 'Download 10 resources', '📖', 100, 'uncommon', 'exploration', '{"resources_downloaded": 10}'),
('Research Master', 'Download 50 resources', '🎓', 250, 'rare', 'exploration', '{"resources_downloaded": 50}'),
('Campus Navigator', 'Explore all features', '🧭', 300, 'rare', 'exploration', '{"features_explored": 20}'),

-- Milestone (5 achievements)
('Rising Star', 'Reach 100 total points', '🌟', 100, 'uncommon', 'milestone', '{"total_points": 100}'),
('Campus Elite', 'Reach 500 total points', '💎', 200, 'rare', 'milestone', '{"total_points": 500}'),
('Legend', 'Reach 1000 total points', '👑', 500, 'epic', 'milestone', '{"total_points": 1000}'),
('Popular Post', 'Get 50 likes on a single post', '❤️', 150, 'uncommon', 'milestone', '{"post_likes": 50}'),
('Viral Content', 'Get 200 likes on a single post', '🔥', 400, 'epic', 'milestone', '{"post_likes": 200}'),

-- Special (4 achievements)
('Early Adopter', 'Join during the first month', '🚀', 200, 'rare', 'special', '{"joined_early": true}'),
('Birthday Star', 'Log in on your birthday', '🎂', 100, 'uncommon', 'special', '{"birthday_login": true}'),
('Night Owl', 'Post at midnight', '🦉', 75, 'uncommon', 'special', '{"midnight_post": true}'),
('Perfectionist', 'Complete all profile sections 100%', '✨', 250, 'rare', 'special', '{"profile_perfect": true}')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES (Run these to check everything worked)
-- ============================================================================

-- Check achievements count
SELECT COUNT(*) as total_achievements FROM achievements;

-- Check table structure
SELECT 
  'achievements' as table_name,
  COUNT(*) as row_count
FROM achievements
UNION ALL
SELECT 
  'user_achievements' as table_name,
  COUNT(*) as row_count
FROM user_achievements
UNION ALL
SELECT 
  'user_stats' as table_name,
  COUNT(*) as row_count
FROM user_stats
UNION ALL
SELECT 
  'user_email_preferences' as table_name,
  COUNT(*) as row_count
FROM user_email_preferences
UNION ALL
SELECT 
  'email_logs' as table_name,
  COUNT(*) as row_count
FROM email_logs;

-- ============================================================================
-- SETUP COMPLETE!
-- Expected output: 24 achievements, 5 tables ready
-- ============================================================================
