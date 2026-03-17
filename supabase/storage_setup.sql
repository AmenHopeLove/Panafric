-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cms-images', 'cms-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to read files
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'cms-images');

-- 3. Allow admins to upload/manage files
-- Note: Uses the is_admin() function created in fix_permissions.sql
CREATE POLICY "Admins manage objects" ON storage.objects
  FOR ALL USING (
    bucket_id = 'cms-images' AND 
    public.is_admin()
  );
