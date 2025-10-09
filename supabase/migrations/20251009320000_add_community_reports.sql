-- Add community reports table for content moderation
-- This will allow users to report inappropriate content

-- Community reports table
CREATE TABLE IF NOT EXISTS community_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- User who reported
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE, -- Reported post
    comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE, -- Reported comment
    reported_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Reported user
    group_id UUID REFERENCES community_groups(id) ON DELETE CASCADE, -- Reported group
    event_id UUID REFERENCES events(id) ON DELETE CASCADE, -- Reported event
    poll_id UUID REFERENCES community_polls(id) ON DELETE CASCADE, -- Reported poll
    reason TEXT NOT NULL, -- Reason for report (e.g., spam, harassment, inappropriate content)
    description TEXT, -- Additional details about the report
    status TEXT DEFAULT 'pending' NOT NULL, -- pending, reviewed, resolved, dismissed
    moderator_notes TEXT, -- Notes from moderators
    resolved_at TIMESTAMPTZ, -- When the report was resolved
    resolved_by UUID REFERENCES auth.users(id), -- Moderator who resolved the report
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Ensure only one target type is set
    CONSTRAINT one_target_type CHECK (
        (post_id IS NOT NULL)::integer +
        (comment_id IS NOT NULL)::integer +
        (reported_user_id IS NOT NULL)::integer +
        (group_id IS NOT NULL)::integer +
        (event_id IS NOT NULL)::integer +
        (poll_id IS NOT NULL)::integer = 1
    )
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_reports_user_id ON community_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_post_id ON community_reports(post_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_comment_id ON community_reports(comment_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_reported_user_id ON community_reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_group_id ON community_reports(group_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_event_id ON community_reports(event_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_poll_id ON community_reports(poll_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_status ON community_reports(status);
CREATE INDEX IF NOT EXISTS idx_community_reports_created_at ON community_reports(created_at);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_community_reports_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS community_reports_updated_at ON community_reports;
CREATE TRIGGER community_reports_updated_at 
BEFORE UPDATE ON community_reports 
FOR EACH ROW EXECUTE FUNCTION update_community_reports_timestamp();

-- RLS Policies
ALTER TABLE community_reports ENABLE ROW LEVEL SECURITY;

-- Users can create reports
CREATE POLICY "Users can create reports" ON community_reports 
FOR INSERT TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Moderators can view all reports
CREATE POLICY "Moderators can view reports" ON community_reports 
FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.user_id = auth.uid() 
        AND admin_users.role IN ('admin', 'super_admin')
    )
);

-- Moderators can update reports
CREATE POLICY "Moderators can update reports" ON community_reports 
FOR UPDATE TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.user_id = auth.uid() 
        AND admin_users.role IN ('admin', 'super_admin')
    )
);

-- Users can view their own reports
CREATE POLICY "Users can view own reports" ON community_reports 
FOR SELECT TO authenticated 
USING (user_id = auth.uid());

COMMENT ON TABLE community_reports IS 'Community content reports for moderation';
COMMENT ON CONSTRAINT one_target_type ON community_reports IS 'Ensures only one content type is reported per report';