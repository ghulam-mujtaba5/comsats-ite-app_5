-- ============================================================================
-- EXPAND NOTIFICATION SYSTEM
-- Add comprehensive notification types for all user actions and system events
-- ============================================================================

-- ============================================================================
-- 1. EXPAND NOTIFICATION TYPES
-- ============================================================================

-- Add new notification types to the notifications table
ALTER TABLE notifications 
DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type IN (
  -- Existing types
  'like', 'comment', 'reply', 'mention', 'follow', 
  'post_approved', 'post_rejected', 'resource_approved', 'resource_rejected',
  'support_ticket_response', 'support_ticket_closed', 
  'role_assigned', 'role_removed',
  'blog_published', 'guidance_published',
  'event_reminder', 'news_update',
  'admin_message', 'system_alert',
  
  -- New authentication & user events
  'user_login', 'user_logout', 'user_register', 'password_reset', 'password_change',
  
  -- New content update events
  'post_created', 'post_updated', 'post_deleted',
  'comment_created', 'comment_updated', 'comment_deleted',
  'resource_uploaded', 'resource_updated', 'resource_deleted',
  'blog_created', 'blog_updated', 'blog_deleted',
  'guidance_created', 'guidance_updated', 'guidance_deleted',
  
  -- New administrative actions
  'admin_login', 'admin_grant', 'admin_revoke',
  'content_approve', 'content_reject', 'content_delete',
  'user_ban', 'user_unban', 'user_delete',
  'settings_update', 'permissions_change',
  
  -- New review & faculty events
  'review_submitted', 'review_approved', 'review_rejected',
  'review_updated', 'faculty_added', 'faculty_updated',
  
  -- New timetable events
  'timetable_updated', 'timetable_added', 'timetable_deleted',
  
  -- New community interactions
  'group_created', 'group_joined', 'group_left',
  'poll_created', 'poll_ended', 'poll_deleted',
  'achievement_unlocked', 'badge_earned',
  
  -- New system events
  'maintenance_scheduled', 'maintenance_completed',
  'new_feature', 'announcement'
));

-- Add new related types to the notifications table
ALTER TABLE notifications 
DROP CONSTRAINT IF EXISTS notifications_related_type_check;

ALTER TABLE notifications 
ADD CONSTRAINT notifications_related_type_check 
CHECK (related_type IN (
  -- Existing types
  'post', 'comment', 'reply', 'resource', 'event', 'news', 
  'blog', 'guidance', 'support_ticket', 'user', 'lost_found',
  
  -- New types
  'faculty', 'review', 'timetable', 'group', 'poll',
  'achievement', 'badge', 'admin_action'
));

-- ============================================================================
-- 2. EXPAND EMAIL CONFIGURATION TYPES
-- ============================================================================

-- Insert new email configuration types
INSERT INTO email_config (email_type, is_enabled, requires_approval, daily_limit, monthly_limit, priority) VALUES
-- Authentication events
('user_register', TRUE, FALSE, 100, 3000, 9),
('password_reset', TRUE, FALSE, 200, 6000, 8),
('password_change', TRUE, FALSE, 100, 3000, 7),

-- Content updates
('post_created', TRUE, FALSE, 200, 6000, 6),
('post_approved', TRUE, FALSE, 100, 3000, 7),
('resource_uploaded', TRUE, FALSE, 50, 1500, 7),
('blog_published', TRUE, FALSE, 25, 750, 8),
('guidance_published', TRUE, FALSE, 25, 750, 8),

-- Administrative actions
('admin_grant', TRUE, TRUE, 20, 600, 10),
('content_approve', TRUE, FALSE, 100, 3000, 6),
('user_ban', TRUE, TRUE, 10, 300, 10),

-- Review & faculty events
('review_submitted', TRUE, FALSE, 100, 3000, 6),
('review_approved', TRUE, FALSE, 100, 3000, 7),
('faculty_added', TRUE, FALSE, 50, 1500, 7),

-- Timetable events
('timetable_updated', TRUE, FALSE, 25, 750, 8),

-- Community interactions
('group_joined', TRUE, FALSE, 100, 3000, 5),
('poll_created', TRUE, FALSE, 50, 1500, 6),
('achievement_unlocked', TRUE, FALSE, 200, 6000, 4),

-- System events
('maintenance_scheduled', TRUE, TRUE, 5, 150, 10),
('new_feature', TRUE, TRUE, 10, 300, 9),
('announcement', TRUE, TRUE, 20, 600, 9)
ON CONFLICT (email_type) DO UPDATE SET
  is_enabled = EXCLUDED.is_enabled,
  requires_approval = EXCLUDED.requires_approval,
  daily_limit = EXCLUDED.daily_limit,
  monthly_limit = EXCLUDED.monthly_limit,
  priority = EXCLUDED.priority;

-- ============================================================================
-- 3. EXPAND USER EMAIL PREFERENCES
-- ============================================================================

-- Add new columns to user_email_preferences table
ALTER TABLE user_email_preferences 
ADD COLUMN IF NOT EXISTS user_login BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS user_logout BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS user_register BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS password_reset BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS password_change BOOLEAN DEFAULT TRUE,

ADD COLUMN IF NOT EXISTS post_created BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS post_updated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS post_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS resource_uploaded BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS resource_updated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS resource_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS blog_created BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS blog_updated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS blog_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS guidance_created BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS guidance_updated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS guidance_deleted BOOLEAN DEFAULT FALSE,

ADD COLUMN IF NOT EXISTS admin_login BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS admin_grant BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS admin_revoke BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS content_approve BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS content_reject BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS user_ban BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS user_unban BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS user_delete BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS settings_update BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS permissions_change BOOLEAN DEFAULT FALSE,

ADD COLUMN IF NOT EXISTS review_submitted BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS review_approved BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS review_rejected BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS review_updated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS faculty_added BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS faculty_updated BOOLEAN DEFAULT FALSE,

ADD COLUMN IF NOT EXISTS timetable_updated BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS timetable_added BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS timetable_deleted BOOLEAN DEFAULT FALSE,

ADD COLUMN IF NOT EXISTS group_created BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS group_joined BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS group_left BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS poll_created BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS poll_ended BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS poll_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS achievement_unlocked BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS badge_earned BOOLEAN DEFAULT TRUE,

ADD COLUMN IF NOT EXISTS maintenance_scheduled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS maintenance_completed BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS new_feature BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS announcement BOOLEAN DEFAULT TRUE;

-- ============================================================================
-- 4. CREATE NEW NOTIFICATION FUNCTIONS
-- ============================================================================

-- Function to create audit log and notification in one call
CREATE OR REPLACE FUNCTION create_audit_notification(
  p_user_id UUID,
  p_actor_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_link TEXT DEFAULT NULL,
  p_related_id UUID DEFAULT NULL,
  p_related_type TEXT DEFAULT NULL,
  p_action TEXT DEFAULT NULL,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  -- Create notification
  INSERT INTO notifications (user_id, actor_id, type, title, message, link, related_id, related_type)
  VALUES (p_user_id, p_actor_id, p_type, p_title, p_message, p_link, p_related_id, p_related_type)
  RETURNING id INTO notification_id;
  
  -- Create audit log if action is provided
  IF p_action IS NOT NULL THEN
    INSERT INTO activity_logs (user_id, action, resource_type, resource_id, details)
    VALUES (p_actor_id, p_action, p_resource_type, p_resource_id, p_details);
  END IF;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to send bulk notifications with audit logging
CREATE OR REPLACE FUNCTION send_bulk_notifications_with_audit(
  p_notifications JSONB,
  p_actor_id UUID,
  p_action TEXT DEFAULT NULL,
  p_resource_type TEXT DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
) RETURNS VOID AS $$
DECLARE
  notification JSONB;
  user_id UUID;
  type TEXT;
  title TEXT;
  message TEXT;
  link TEXT;
  related_id UUID;
  related_type TEXT;
BEGIN
  -- Create audit log for the bulk action
  IF p_action IS NOT NULL THEN
    INSERT INTO activity_logs (user_id, action, resource_type, details)
    VALUES (p_actor_id, p_action, p_resource_type, p_details);
  END IF;
  
  -- Process each notification
  FOR notification IN SELECT jsonb_array_elements(p_notifications)
  LOOP
    user_id := (notification->>'user_id')::UUID;
    type := notification->>'type';
    title := notification->>'title';
    message := notification->>'message';
    link := notification->>'link';
    related_id := (notification->>'related_id')::UUID;
    related_type := notification->>'related_type';
    
    INSERT INTO notifications (user_id, actor_id, type, title, message, link, related_id, related_type)
    VALUES (user_id, p_actor_id, type, title, message, link, related_id, related_type);
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 5. CREATE BATCH NOTIFICATION PROCESSING TABLE
-- ============================================================================

-- Create table for batch notification processing
CREATE TABLE IF NOT EXISTS batch_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  recipients JSONB DEFAULT '[]', -- Array of user IDs or filters
  notification_template JSONB NOT NULL, -- Template for notifications
  email_template JSONB, -- Template for emails (optional)
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  scheduled_for TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  error_message TEXT,
  progress INTEGER DEFAULT 0, -- Percentage complete
  total_recipients INTEGER DEFAULT 0,
  processed_recipients INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_batch_notifications_status ON batch_notifications(status);
CREATE INDEX IF NOT EXISTS idx_batch_notifications_scheduled_for ON batch_notifications(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_batch_notifications_created_by ON batch_notifications(created_by);

-- Update timestamp trigger for batch notifications
DROP TRIGGER IF EXISTS update_batch_notifications_updated_at ON batch_notifications;
CREATE TRIGGER update_batch_notifications_updated_at 
BEFORE UPDATE ON batch_notifications 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. CREATE NOTIFICATION SUBSCRIPTIONS TABLE
-- ============================================================================

-- Create table for user notification subscriptions (opt-in/opt-out for specific events)
CREATE TABLE IF NOT EXISTS notification_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- Type of event user is subscribed to
  is_subscribed BOOLEAN DEFAULT TRUE, -- Opt-in or opt-out
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_type)
);

CREATE INDEX IF NOT EXISTS idx_notification_subscriptions_user_id ON notification_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_subscriptions_event_type ON notification_subscriptions(event_type);

-- Update timestamp trigger for notification subscriptions
DROP TRIGGER IF EXISTS update_notification_subscriptions_updated_at ON notification_subscriptions;
CREATE TRIGGER update_notification_subscriptions_updated_at 
BEFORE UPDATE ON notification_subscriptions 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. RLS POLICIES FOR NEW TABLES
-- ============================================================================

-- Batch notifications
ALTER TABLE batch_notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own batch notifications" ON batch_notifications;
DROP POLICY IF EXISTS "Users can create batch notifications" ON batch_notifications;
DROP POLICY IF EXISTS "Users can update their own batch notifications" ON batch_notifications;

CREATE POLICY "Users can view their own batch notifications" ON batch_notifications 
FOR SELECT USING (auth.uid() = created_by OR auth.uid() IN (SELECT jsonb_array_elements_text(recipients)::UUID));

CREATE POLICY "Admins can manage batch notifications" ON batch_notifications 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN custom_roles cr ON ur.role_id = cr.id
    WHERE ur.user_id = auth.uid() AND cr.name IN ('super_admin', 'admin')
  )
);

-- Notification subscriptions
ALTER TABLE notification_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON notification_subscriptions;

CREATE POLICY "Users can manage their own subscriptions" ON notification_subscriptions 
FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- COMPLETE!
-- ============================================================================
