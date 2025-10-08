-- Additional schema for help desk system

-- Help Desk Tickets Table
CREATE TABLE IF NOT EXISTS help_desk_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technical', 'academic', 'account', 'finance', 'other')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
  admin_response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_help_desk_tickets_user_id ON help_desk_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_help_desk_tickets_status ON help_desk_tickets(status);
CREATE INDEX IF NOT EXISTS idx_help_desk_tickets_category ON help_desk_tickets(category);
CREATE INDEX IF NOT EXISTS idx_help_desk_tickets_created_at ON help_desk_tickets(created_at DESC);

-- RLS Policies
ALTER TABLE help_desk_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tickets" ON help_desk_tickets;
CREATE POLICY "Users can view own tickets" ON help_desk_tickets
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own tickets" ON help_desk_tickets;
CREATE POLICY "Users can create own tickets" ON help_desk_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own tickets" ON help_desk_tickets;
CREATE POLICY "Users can update own tickets" ON help_desk_tickets
  FOR UPDATE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_help_desk_tickets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER help_desk_tickets_updated_at
  BEFORE UPDATE ON help_desk_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_help_desk_tickets_updated_at();

-- Guidance Content Table (enhanced)
-- Drop existing constraint if it exists and recreate with correct values
DO $$ BEGIN
  ALTER TABLE IF EXISTS guidance_content DROP CONSTRAINT IF EXISTS guidance_content_category_check;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS guidance_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  is_important BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add constraint after table exists
ALTER TABLE guidance_content DROP CONSTRAINT IF EXISTS guidance_content_category_check;
ALTER TABLE guidance_content ADD CONSTRAINT guidance_content_category_check
  CHECK (category IN ('academic', 'career', 'financial', 'technical', 'general'));

-- Indexes for guidance content
CREATE INDEX IF NOT EXISTS idx_guidance_content_category ON guidance_content(category);
CREATE INDEX IF NOT EXISTS idx_guidance_content_is_published ON guidance_content(is_published);
CREATE INDEX IF NOT EXISTS idx_guidance_content_is_important ON guidance_content(is_important);

-- RLS for guidance content
ALTER TABLE guidance_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published guidance" ON guidance_content;
CREATE POLICY "Anyone can view published guidance" ON guidance_content
  FOR SELECT USING (is_published = true);

-- FAQ Items Table
CREATE TABLE IF NOT EXISTS faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('academic', 'technical', 'finance', 'general')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add display_order column if it doesn't exist
DO $$ BEGIN
  ALTER TABLE faq_items ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Indexes for FAQ
CREATE INDEX IF NOT EXISTS idx_faq_items_category ON faq_items(category);
CREATE INDEX IF NOT EXISTS idx_faq_items_is_published ON faq_items(is_published);
CREATE INDEX IF NOT EXISTS idx_faq_items_display_order ON faq_items(display_order);

-- RLS for FAQ
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published FAQs" ON faq_items;
CREATE POLICY "Anyone can view published FAQs" ON faq_items
  FOR SELECT USING (is_published = true);

-- Student Support Resources Table
CREATE TABLE IF NOT EXISTS student_support_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('academic', 'mental-health', 'career', 'financial', 'technical', 'general')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  contact_info TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_student_support_category ON student_support_resources(category);
CREATE INDEX IF NOT EXISTS idx_student_support_is_active ON student_support_resources(is_active);

-- RLS
ALTER TABLE student_support_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active support resources" ON student_support_resources;
CREATE POLICY "Anyone can view active support resources" ON student_support_resources
  FOR SELECT USING (is_active = true);

COMMENT ON TABLE help_desk_tickets IS 'Support tickets from students';
COMMENT ON TABLE guidance_content IS 'Student guidance articles and resources';
COMMENT ON TABLE faq_items IS 'Frequently asked questions';
COMMENT ON TABLE student_support_resources IS 'Student support resources and contacts';
