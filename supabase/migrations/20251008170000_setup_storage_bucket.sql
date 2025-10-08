-- Create storage bucket for lost and found item images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lost-found-images',
  'lost-found-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the bucket
CREATE POLICY "Public can view lost-found images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'lost-found-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload lost-found images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'lost-found-images');

-- Allow users to update their own images
CREATE POLICY "Users can update their own lost-found images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'lost-found-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own lost-found images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'lost-found-images' AND auth.uid()::text = (storage.foldername(name))[1]);
