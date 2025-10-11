-- ============================================================================
-- COMPLETE NOTIFICATION & SUPPORT SYSTEM
-- ============================================================================

-- ============================================================================
-- 1. ENHANCED NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN (
    'like', 'comment', 'reply', 'mention', 'follow', 
    'post_approved', 'post_rejected', 'resource_approved', 'resource_rejected',
    'support_ticket_response', 'support_ticket_closed', 
    'role_assigned', 'role_removed',
    'blog_published', 'guidance_published',
    'event_reminder', 'news_update',
    'admin_message', 'system_alert'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  related_id UUID,
  related_type TEXT CHECK (related_type IN (
    'post', 'comment', 'reply', 'resource', 'event', 'news', 
    'blog', 'guidance', 'support_ticket', 'user', 'lost_found'
  )),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_related ON notifications(related_type, related_id);

-- ============================================================================
-- 2. SUPPORT TICKETS SYSTEM
-- ============================================================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN (
    'technical', 'academic', 'account', 'content', 
    'faculty', 'resource', 'general', 'bug_report', 'feature_request'
  )),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'reopened')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);

-- Support ticket responses
CREATE TABLE IF NOT EXISTS support_ticket_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_staff BOOLEAN DEFAULT FALSE,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_responses_ticket_id ON support_ticket_responses(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_responses_created_at ON support_ticket_responses(created_at DESC);

-- ============================================================================
-- 3. CUSTOM ROLES & PERMISSIONS SYSTEM
-- ============================================================================
CREATE TABLE IF NOT EXISTS custom_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  is_system_role BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User role assignments
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES custom_roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

-- Insert system roles
INSERT INTO custom_roles (name, display_name, description, is_system_role, permissions) VALUES
('super_admin', 'Super Administrator', 'Full system access with all permissions', TRUE, 
  '{"all": true, "manage_users": true, "manage_roles": true, "manage_content": true, "manage_emails": true, "view_analytics": true, "manage_settings": true}'::jsonb),
('admin', 'Administrator', 'Manage content and moderate users', TRUE,
  '{"manage_content": true, "moderate_posts": true, "manage_resources": true, "respond_support": true}'::jsonb),
('moderator', 'Moderator', 'Moderate community content', TRUE,
  '{"moderate_posts": true, "moderate_comments": true, "respond_support": true}'::jsonb),
('faculty', 'Faculty Member', 'Faculty-specific permissions', TRUE,
  '{"create_resources": true, "respond_support": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 4. EMAIL QUEUE & MANAGEMENT SYSTEM
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  email_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_data JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'sending', 'sent', 'failed', 'cancelled')),
  priority INTEGER DEFAULT 5,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  scheduled_for TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled_for ON email_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_email_queue_priority ON email_queue(priority DESC);

-- Email configuration
CREATE TABLE IF NOT EXISTS email_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_type TEXT NOT NULL UNIQUE,
  is_enabled BOOLEAN DEFAULT TRUE,
  requires_approval BOOLEAN DEFAULT FALSE,
  daily_limit INTEGER,
  monthly_limit INTEGER,
  priority INTEGER DEFAULT 5,
  metadata JSONB DEFAULT '{}',
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default email configurations
INSERT INTO email_config (email_type, is_enabled, requires_approval, daily_limit, monthly_limit, priority) VALUES
('achievement', TRUE, FALSE, 100, 3000, 5),
('comment', TRUE, FALSE, 200, 6000, 4),
('like', TRUE, FALSE, 100, 3000, 3),
('welcome', TRUE, FALSE, 50, 1500, 8),
('resource_approved', TRUE, FALSE, 50, 1500, 7),
('weekly_digest', TRUE, TRUE, 1000, 4000, 2),
('support_response', TRUE, FALSE, 100, 3000, 9),
('admin_message', TRUE, TRUE, 50, 500, 10)
ON CONFLICT (email_type) DO NOTHING;

-- ============================================================================
-- 5. ACTIVITY LOGS FOR SUPER ADMIN
-- ============================================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_resource ON activity_logs(resource_type, resource_id);

-- ============================================================================
-- 6. BLOGS SYSTEM
-- ============================================================================
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  category TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON blogs(author_id);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_tags ON blogs USING GIN(tags);

-- ============================================================================
-- 7. GUIDANCE MATERIALS SYSTEM
-- ============================================================================
CREATE TABLE IF NOT EXISTS guidance_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'academic', 'career', 'exam_prep', 'study_tips', 
    'time_management', 'mental_health', 'scholarships', 'internships'
  )),
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  tags TEXT[] DEFAULT '{}',
  attachments JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'archived')),
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guidance_author_id ON guidance_materials(author_id);
CREATE INDEX IF NOT EXISTS idx_guidance_category ON guidance_materials(category);
CREATE INDEX IF NOT EXISTS idx_guidance_status ON guidance_materials(status);
CREATE INDEX IF NOT EXISTS idx_guidance_tags ON guidance_materials USING GIN(tags);

-- ============================================================================
-- 8. SHARE TRACKING
-- ============================================================================
CREATE TABLE IF NOT EXISTS share_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  platform TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_share_analytics_resource ON share_analytics(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_share_analytics_platform ON share_analytics(platform);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Support Tickets
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own tickets" ON support_tickets FOR SELECT USING (auth.uid() = user_id OR auth.uid() = assigned_to);
CREATE POLICY "Users can create tickets" ON support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tickets" ON support_tickets FOR UPDATE USING (auth.uid() = user_id);

-- Support Ticket Responses
ALTER TABLE support_ticket_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view responses to their tickets" ON support_ticket_responses FOR SELECT 
  USING (EXISTS (SELECT 1 FROM support_tickets WHERE id = ticket_id AND user_id = auth.uid()));
CREATE POLICY "Users can create responses" ON support_ticket_responses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Blogs
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published blogs are viewable by everyone" ON blogs FOR SELECT USING (status = 'published' OR auth.uid() = author_id);
CREATE POLICY "Authors can manage their blogs" ON blogs FOR ALL USING (auth.uid() = author_id);

-- Guidance Materials
ALTER TABLE guidance_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published guidance is viewable by everyone" ON guidance_materials FOR SELECT USING (status = 'published' OR auth.uid() = author_id);
CREATE POLICY "Authors can manage their guidance" ON guidance_materials FOR ALL USING (auth.uid() = author_id);

-- Activity Logs (admin only)
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view logs" ON activity_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles ur 
    JOIN custom_roles cr ON ur.role_id = cr.id 
    WHERE ur.user_id = auth.uid() AND cr.name IN ('super_admin', 'admin'))
);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_actor_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_link TEXT DEFAULT NULL,
  p_related_id UUID DEFAULT NULL,
  p_related_type TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, actor_id, type, title, message, link, related_id, related_type)
  VALUES (p_user_id, p_actor_id, p_type, p_title, p_message, p_link, p_related_id, p_related_type)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO activity_logs (user_id, action, resource_type, resource_id, details)
  VALUES (p_user_id, p_action, p_resource_type, p_resource_id, p_details)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guidance_updated_at BEFORE UPDATE ON guidance_materials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMPLETE!
-- ============================================================================
