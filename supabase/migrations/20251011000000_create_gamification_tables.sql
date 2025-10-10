-- Gamification System: Achievements, User Achievements, and Leaderboard
-- Run this migration to enable the complete gamification system

-- =====================================================
-- 1. ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  category TEXT NOT NULL CHECK (category IN ('participation', 'contribution', 'exploration', 'milestone', 'special')),
  criteria JSONB, -- Store achievement unlock criteria (e.g., {"posts": 10, "likes": 50})
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. USER ACHIEVEMENTS TABLE (Junction Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id) -- Prevent duplicate achievements per user
);

-- =====================================================
-- 3. USER STATS TABLE (Track progress toward achievements)
-- =====================================================
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. LEADERBOARD MATERIALIZED VIEW
-- =====================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS leaderboard AS
SELECT 
  us.user_id,
  COALESCE(up.full_name, u.email) AS user_name,
  up.avatar_url AS user_avatar,
  up.bio,
  up.campus_id,
  up.department_id,
  us.total_points,
  us.posts_count,
  us.comments_count,
  us.likes_received,
  COUNT(ua.id) AS achievements_count,
  ROW_NUMBER() OVER (ORDER BY us.total_points DESC, us.posts_count DESC) AS rank
FROM user_stats us
LEFT JOIN auth.users u ON us.user_id = u.id
LEFT JOIN user_profiles up ON us.user_id = up.user_id
LEFT JOIN user_achievements ua ON us.user_id = ua.user_id
GROUP BY us.user_id, u.email, up.full_name, up.avatar_url, up.bio, up.campus_id, up.department_id, us.total_points, us.posts_count, us.comments_count, us.likes_received
ORDER BY rank;

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX IF NOT EXISTS idx_leaderboard_user_id ON leaderboard(user_id);

-- =====================================================
-- 5. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_rarity ON achievements(rarity);
CREATE INDEX IF NOT EXISTS idx_user_stats_total_points ON user_stats(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_posts_count ON user_stats(posts_count DESC);

-- =====================================================
-- 6. FUNCTIONS
-- =====================================================

-- Function to refresh leaderboard
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update user stats timestamp
CREATE OR REPLACE FUNCTION update_user_stats_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to initialize user stats when user is created
CREATE OR REPLACE FUNCTION initialize_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. TRIGGERS
-- =====================================================

-- Trigger to refresh leaderboard when achievements are unlocked
CREATE TRIGGER trigger_refresh_leaderboard_on_achievement
AFTER INSERT OR DELETE ON user_achievements
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_leaderboard();

-- Trigger to refresh leaderboard when user stats change
CREATE TRIGGER trigger_refresh_leaderboard_on_stats
AFTER UPDATE OF total_points ON user_stats
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_leaderboard();

-- Trigger to update user_stats timestamp
CREATE TRIGGER trigger_update_user_stats_timestamp
BEFORE UPDATE ON user_stats
FOR EACH ROW
EXECUTE FUNCTION update_user_stats_timestamp();

-- Trigger to initialize stats when user signs up
CREATE TRIGGER trigger_initialize_user_stats
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION initialize_user_stats();

-- =====================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Everyone can view achievements
CREATE POLICY "achievements_select_all" ON achievements
  FOR SELECT USING (true);

-- Only admins can manage achievements
CREATE POLICY "achievements_insert_admin" ON achievements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "achievements_update_admin" ON achievements
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

-- Users can view their own achievements and others' achievements
CREATE POLICY "user_achievements_select_all" ON user_achievements
  FOR SELECT USING (true);

-- System can insert achievements (via API with service role)
CREATE POLICY "user_achievements_insert_system" ON user_achievements
  FOR INSERT WITH CHECK (true);

-- Users can view all user stats (for leaderboard)
CREATE POLICY "user_stats_select_all" ON user_stats
  FOR SELECT USING (true);

-- Only the user or system can update their own stats
CREATE POLICY "user_stats_update_own" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- System can insert user stats
CREATE POLICY "user_stats_insert_system" ON user_stats
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- 9. SEED ACHIEVEMENTS
-- =====================================================

INSERT INTO achievements (title, description, icon, points, rarity, category, criteria) VALUES
  -- Participation Achievements
  ('First Steps', 'Create your first post in the community', '👶', 10, 'common', 'participation', '{"posts": 1}'),
  ('Conversation Starter', 'Create 10 posts in the community', '💬', 50, 'uncommon', 'participation', '{"posts": 10}'),
  ('Prolific Poster', 'Create 50 posts in the community', '📝', 150, 'rare', 'participation', '{"posts": 50}'),
  ('Community Leader', 'Create 100 posts in the community', '👑', 500, 'epic', 'participation', '{"posts": 100}'),
  
  -- Contribution Achievements
  ('Helpful Hand', 'Post 10 helpful comments', '🤝', 25, 'common', 'contribution', '{"comments": 10}'),
  ('Supportive Spirit', 'Post 50 comments', '💪', 75, 'uncommon', 'contribution', '{"comments": 50}'),
  ('Resource Provider', 'Upload 5 learning resources', '📚', 100, 'rare', 'contribution', '{"resources": 5}'),
  ('Paper Contributor', 'Upload 10 past papers', '📄', 150, 'rare', 'contribution', '{"papers": 10}'),
  ('Knowledge Sharer', 'Upload 20 resources or papers', '🎓', 300, 'epic', 'contribution', '{"resources": 20}'),
  
  -- Social Achievements
  ('Popular Voice', 'Receive 50 likes on your posts', '⭐', 100, 'uncommon', 'participation', '{"likes_received": 50}'),
  ('Influencer', 'Receive 200 likes on your posts', '🌟', 250, 'rare', 'participation', '{"likes_received": 200}'),
  ('Celebrity', 'Receive 500 likes on your posts', '💫', 500, 'epic', 'participation', '{"likes_received": 500}'),
  ('Viral Sensation', 'Receive 1000 likes on your posts', '🔥', 1000, 'legendary', 'participation', '{"likes_received": 1000}'),
  
  -- Exploration Achievements
  ('Explorer', 'Visit all major pages on the site', '🗺️', 50, 'uncommon', 'exploration', '{"pages_visited": 10}'),
  ('Curious Mind', 'Use search feature 20 times', '🔍', 25, 'common', 'exploration', '{"searches": 20}'),
  
  -- Milestone Achievements
  ('Semester Complete', 'Access resources for an entire semester', '🎓', 150, 'rare', 'milestone', '{"semester_resources": 1}'),
  ('Year Complete', 'Access resources for an entire year', '📅', 300, 'epic', 'milestone', '{"year_resources": 1}'),
  ('Point Master', 'Earn 1000 total points', '💰', 0, 'epic', 'milestone', '{"total_points": 1000}'),
  ('Point Legend', 'Earn 5000 total points', '🏆', 0, 'legendary', 'milestone', '{"total_points": 5000}'),
  
  -- Special Achievements
  ('Early Adopter', 'One of the first 100 registered users', '🚀', 500, 'legendary', 'special', '{}'),
  ('Beta Tester', 'Participated in beta testing', '🧪', 250, 'epic', 'special', '{}'),
  ('Feedback Champion', 'Submitted 5 feedback reports', '📋', 100, 'rare', 'special', '{"feedback": 5}'),
  ('Bug Hunter', 'Reported 3 verified bugs', '🐛', 200, 'epic', 'special', '{"bugs": 3}')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 10. INITIAL DATA REFRESH
-- =====================================================

-- Refresh the leaderboard view
REFRESH MATERIALIZED VIEW leaderboard;

-- Grant permissions to authenticated users
GRANT SELECT ON achievements TO authenticated;
GRANT SELECT ON user_achievements TO authenticated;
GRANT SELECT ON user_stats TO authenticated;
GRANT SELECT ON leaderboard TO authenticated;

-- =====================================================
-- DONE! Gamification system is ready to use
-- =====================================================

-- Usage Examples:
-- 1. Get all achievements: SELECT * FROM achievements WHERE is_active = true;
-- 2. Get user's achievements: SELECT * FROM user_achievements WHERE user_id = '<user_id>';
-- 3. Get leaderboard: SELECT * FROM leaderboard LIMIT 50;
-- 4. Get user's rank: SELECT rank FROM leaderboard WHERE user_id = '<user_id>';
-- 5. Unlock achievement: INSERT INTO user_achievements (user_id, achievement_id) VALUES ('<user_id>', '<achievement_id>');
