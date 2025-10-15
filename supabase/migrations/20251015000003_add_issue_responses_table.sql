-- Add issue_responses table for issue tracking system
CREATE TABLE IF NOT EXISTS issue_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issue_reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_issue_responses_issue_id ON issue_responses(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_responses_created_at ON issue_responses(created_at DESC);

-- Enable RLS
ALTER TABLE issue_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view responses to their own issues
CREATE POLICY "Users can view responses to their issues" ON issue_responses 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM issue_reports 
    WHERE id = issue_id AND (user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  )
);

-- Admins can view all responses
CREATE POLICY "Admins can view all responses" ON issue_responses 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN custom_roles cr ON ur.role_id = cr.id
    WHERE ur.user_id = auth.uid() AND cr.name IN ('super_admin', 'admin', 'moderator')
  )
);

-- Users can create responses to their own issues
CREATE POLICY "Users can respond to their issues" ON issue_responses 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM issue_reports 
    WHERE id = issue_id AND (user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  )
);

-- Admins can create responses to any issue
CREATE POLICY "Admins can respond to any issue" ON issue_responses 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN custom_roles cr ON ur.role_id = cr.id
    WHERE ur.user_id = auth.uid() AND cr.name IN ('super_admin', 'admin', 'moderator')
  )
);