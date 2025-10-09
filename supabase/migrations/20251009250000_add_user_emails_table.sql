-- Create table for storing user email addresses
CREATE TABLE IF NOT EXISTS user_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  email_type TEXT NOT NULL DEFAULT 'secondary', -- 'primary', 'secondary', 'personal'
  is_verified BOOLEAN DEFAULT false,
  verification_token UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, email),
  UNIQUE(email) -- Ensure email uniqueness across the platform
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_emails_user_id ON user_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_user_emails_email ON user_emails(email);
CREATE INDEX IF NOT EXISTS idx_user_emails_email_type ON user_emails(email_type);

-- Enable RLS
ALTER TABLE user_emails ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own email addresses
CREATE POLICY "Users can view own emails" ON user_emails
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own email addresses
CREATE POLICY "Users can insert own emails" ON user_emails
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own email addresses
CREATE POLICY "Users can update own emails" ON user_emails
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own email addresses
CREATE POLICY "Users can delete own emails" ON user_emails
  FOR DELETE USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_user_emails_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_emails_updated_at ON user_emails;
CREATE TRIGGER user_emails_updated_at 
  BEFORE UPDATE ON user_emails
  FOR EACH ROW EXECUTE FUNCTION update_user_emails_updated_at();

-- Comments
COMMENT ON TABLE user_emails IS 'User email addresses for alumni access';
COMMENT ON COLUMN user_emails.email_type IS 'Type of email: primary (institutional), secondary (backup institutional), personal (alumni)';