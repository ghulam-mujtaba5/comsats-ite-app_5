-- Remove admissions-related tables as per user request to delete admissions module
-- Drop the merit_lists table which was used for admissions merit lists

DROP TABLE IF EXISTS merit_lists CASCADE;