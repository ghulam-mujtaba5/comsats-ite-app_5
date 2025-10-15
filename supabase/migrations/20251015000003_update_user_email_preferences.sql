-- ============================================================================
-- UPDATE USER EMAIL PREFERENCES
-- Add new columns for granular notification control
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

-- Update the default preferences function to include new columns
CREATE OR REPLACE FUNCTION create_default_email_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_email_preferences (user_id,
    achievements, comments, likes, weekly_digest, resource_updates, community_updates, marketing,
    user_register, password_reset, password_change,
    post_created, resource_uploaded, blog_created, guidance_created,
    admin_grant, admin_revoke, content_approve, user_ban,
    review_submitted, review_approved, faculty_added,
    timetable_updated, group_joined, poll_created, achievement_unlocked,
    maintenance_scheduled, new_feature, announcement
  )
  VALUES (NEW.id,
    TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE,
    TRUE, TRUE, TRUE,
    TRUE, TRUE, TRUE, TRUE,
    TRUE, TRUE, TRUE, TRUE,
    TRUE, TRUE, TRUE,
    TRUE, TRUE, TRUE, TRUE,
    TRUE, TRUE, TRUE
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMPLETE!
-- ============================================================================