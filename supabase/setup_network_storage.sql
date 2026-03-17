-- 1. Create the bucket for network profile pictures
INSERT INTO storage.buckets (id, name, public) 
VALUES ('network-profiles', 'network-profiles', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to read files
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'network-profiles');

-- 3. Allow public to upload their own profile pictures (limited to this bucket)
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
CREATE POLICY "Public Upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'network-profiles');

-- 4. Allow admins to manage all files
DROP POLICY IF EXISTS "Admins manage network profiles" ON storage.objects;
CREATE POLICY "Admins manage network profiles" ON storage.objects
  FOR ALL USING (
    bucket_id = 'network-profiles' AND 
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );
