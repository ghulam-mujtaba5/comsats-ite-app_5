-- Email Notification System
-- Tables for managing email preferences and logs

-- =====================================================
-- 1. USER EMAIL PREFERENCES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_email_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  achievements BOOLEAN DEFAULT TRUE,
  comments BOOLEAN DEFAULT TRUE,
  likes BOOLEAN DEFAULT TRUE,
  weekly_digest BOOLEAN DEFAULT TRUE,
  resource_updates BOOLEAN DEFAULT TRUE,
  community_updates BOOLEAN DEFAULT TRUE,
  marketing BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. EMAIL LOGS TABLE (Optional - for tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  type TEXT NOT NULL,
  subject TEXT,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'bounced')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);

-- =====================================================
-- 4. ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE user_email_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own preferences
CREATE POLICY "user_email_preferences_select_own" ON user_email_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_email_preferences_update_own" ON user_email_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_email_preferences_insert_own" ON user_email_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own email logs
CREATE POLICY "email_logs_select_own" ON email_logs
  FOR SELECT USING (auth.uid() = user_id);

-- System can insert email logs (via service role)
CREATE POLICY "email_logs_insert_system" ON email_logs
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- 5. FUNCTION TO AUTO-CREATE PREFERENCES
-- =====================================================
CREATE OR REPLACE FUNCTION create_default_email_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_email_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. TRIGGER TO CREATE DEFAULT PREFERENCES
-- =====================================================
CREATE TRIGGER trigger_create_default_email_preferences
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_default_email_preferences();

-- =====================================================
-- 7. GRANT PERMISSIONS
-- =====================================================
GRANT SELECT, INSERT, UPDATE ON user_email_preferences TO authenticated;
GRANT SELECT ON email_logs TO authenticated;

-- =====================================================
-- DONE! Email notification system tables created
-- =====================================================
