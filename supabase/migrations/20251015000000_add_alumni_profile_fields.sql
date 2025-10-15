-- Add alumni profile fields to user_preferences table
-- These fields will be used for the alumni portal profile management

-- Add columns for alumni profile information
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS position TEXT,
ADD COLUMN IF NOT EXISTS graduation_year TEXT,
ADD COLUMN IF NOT EXISTS degree TEXT;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_full_name ON user_preferences(full_name);
CREATE INDEX IF NOT EXISTS idx_user_preferences_graduation_year ON user_preferences(graduation_year);
CREATE INDEX IF NOT EXISTS idx_user_preferences_company ON user_preferences(company);

-- Add comments for documentation
COMMENT ON COLUMN user_preferences.full_name IS 'User''s full name for alumni profile';
COMMENT ON COLUMN user_preferences.phone IS 'User''s phone number for alumni profile';
COMMENT ON COLUMN user_preferences.address IS 'User''s address for alumni profile';
COMMENT ON COLUMN user_preferences.company IS 'User''s current company for alumni profile';
COMMENT ON COLUMN user_preferences.position IS 'User''s current position for alumni profile';
COMMENT ON COLUMN user_preferences.graduation_year IS 'User''s graduation year for alumni profile';
COMMENT ON COLUMN user_preferences.degree IS 'User''s degree information for alumni profile';