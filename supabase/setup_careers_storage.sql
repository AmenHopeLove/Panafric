-- Storage Buckets for Careers

-- 1. Create a bucket for career-related media (mentor photos, resource thumbnails)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('career-media', 'career-media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to read files
CREATE POLICY "Public Access for career-media"
ON storage.objects FOR SELECT
USING (bucket_id = 'career-media');

-- 3. Allow authenticated users (Admins) to upload/update/delete
CREATE POLICY "Admin CRUD for career-media"
ON storage.objects FOR ALL
USING (bucket_id = 'career-media');
