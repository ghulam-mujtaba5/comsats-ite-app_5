-- Add polls feature to the community platform
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