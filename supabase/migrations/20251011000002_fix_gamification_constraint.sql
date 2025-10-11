-- Fix existing invalid gamification_role values before applying constraint

-- First, check what invalid values exist
DO $$
BEGIN
  -- Update any invalid gamification_role values to NULL
  UPDATE public.admin_users
  SET gamification_role = NULL
  WHERE gamification_role IS NOT NULL 
    AND gamification_role NOT IN (
      'content-curator',
      'community-moderator',
      'tech-support',
      'campus-ambassador'
    );
    
  RAISE NOTICE 'Fixed invalid gamification_role values';
END $$;
