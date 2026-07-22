-- 1. Re-enable public SELECT access for the 'cms-images' bucket with a unique name.
-- This ensures it doesn't get dropped by other storage scripts.
DROP POLICY IF EXISTS "Public Access for cms-images" ON storage.objects;
CREATE POLICY "Public Access for cms-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'cms-images');

-- 2. Drop the old general admin policy
DROP POLICY IF EXISTS "Admins manage objects" ON storage.objects;

-- 3. Create explicit inline admin policies for 'cms-images' to avoid
-- search-path/resolution issues with public.is_admin() inside the storage schema.
CREATE POLICY "Admins insert objects for cms-images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'cms-images' AND 
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins update objects for cms-images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'cms-images' AND 
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins delete objects for cms-images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'cms-images' AND 
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
