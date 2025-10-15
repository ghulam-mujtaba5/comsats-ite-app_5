-- Update guidance_content table to remove 'admission' category as part of admissions module removal
-- This updates the category check constraint to exclude 'admission' since that module is being deleted

ALTER TABLE guidance_content 
DROP CONSTRAINT IF EXISTS guidance_content_category_check;

ALTER TABLE guidance_content 
ADD CONSTRAINT guidance_content_category_check 
CHECK (category IN ('academic', 'campus', 'financial', 'policies'));