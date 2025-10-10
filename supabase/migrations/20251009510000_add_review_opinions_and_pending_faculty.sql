-- Create review_opinions table for agree/disagree functionality
CREATE TABLE IF NOT EXISTS review_opinions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opinion TEXT NOT NULL CHECK (opinion IN ('agree', 'disagree')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id) -- One opinion per user per review
);

-- Create pending_faculty table for student-submitted faculty awaiting admin approval
CREATE TABLE IF NOT EXISTS pending_faculty (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  designation TEXT DEFAULT 'Lecturer',
  email TEXT,
  phone TEXT,
  specialization TEXT,
  qualifications TEXT,
  campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT,
  approved_faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
  UNIQUE(name, campus_id) -- Prevent duplicate submissions for same faculty at same campus
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_review_opinions_review_id ON review_opinions(review_id);
CREATE INDEX IF NOT EXISTS idx_review_opinions_user_id ON review_opinions(user_id);
CREATE INDEX IF NOT EXISTS idx_pending_faculty_status ON pending_faculty(status);
CREATE INDEX IF NOT EXISTS idx_pending_faculty_campus_id ON pending_faculty(campus_id);
CREATE INDEX IF NOT EXISTS idx_pending_faculty_submitted_by ON pending_faculty(submitted_by);

-- Add RLS policies for review_opinions
ALTER TABLE review_opinions ENABLE ROW LEVEL SECURITY;

-- Users can view all opinions
CREATE POLICY "Anyone can view review opinions"
  ON review_opinions FOR SELECT
  USING (true);

-- Users can insert their own opinions
CREATE POLICY "Users can insert their own opinions"
  ON review_opinions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own opinions
CREATE POLICY "Users can update their own opinions"
  ON review_opinions FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own opinions
CREATE POLICY "Users can delete their own opinions"
  ON review_opinions FOR DELETE
  USING (auth.uid() = user_id);

-- Add RLS policies for pending_faculty
ALTER TABLE pending_faculty ENABLE ROW LEVEL SECURITY;

-- Anyone can view pending faculty (to check if already submitted)
CREATE POLICY "Anyone can view pending faculty"
  ON pending_faculty FOR SELECT
  USING (true);

-- Authenticated users can insert pending faculty
CREATE POLICY "Authenticated users can submit faculty"
  ON pending_faculty FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = submitted_by);

-- Only admins can update pending faculty (handled via service role in API)
CREATE POLICY "Service role can update pending faculty"
  ON pending_faculty FOR UPDATE
  USING (true);

-- Comments for documentation
COMMENT ON TABLE review_opinions IS 'Stores student opinions (agree/disagree) on faculty reviews';
COMMENT ON TABLE pending_faculty IS 'Stores faculty submissions from students pending admin approval';
COMMENT ON COLUMN review_opinions.opinion IS 'User opinion: agree or disagree';
COMMENT ON COLUMN pending_faculty.status IS 'Approval status: pending, approved, or rejected';
COMMENT ON COLUMN pending_faculty.approved_faculty_id IS 'Reference to faculty record if approved';