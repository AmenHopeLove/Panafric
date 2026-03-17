-- 1. Create Cases Table
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    case_type TEXT NOT NULL,
    urgency TEXT DEFAULT 'Standard' CHECK (urgency IN ('Low', 'Standard', 'High', 'Urgent')),
    opposing_party TEXT,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'accepted', 'rejected', 'closed'))
);

-- 2. Create Case Files Table (Linked to Cases)
CREATE TABLE IF NOT EXISTS case_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_url TEXT,
    file_name TEXT NOT NULL,
    file_size BIGINT
);

-- Ensure file_path column exists for those who ran previous versions
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='case_files' AND column_name='file_path') THEN
        ALTER TABLE case_files ADD COLUMN file_path TEXT NOT NULL DEFAULT 'legacy';
    END IF;
END $$;

-- 3. Enable RLS
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_files ENABLE ROW LEVEL SECURITY;

-- 4. Policies (Public Insert for Intake)
DROP POLICY IF EXISTS "Enable public case submission" ON cases;
CREATE POLICY "Enable public case submission" ON cases FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable admin case access" ON cases;
CREATE POLICY "Enable admin case access" ON cases FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable public file entry" ON case_files;
CREATE POLICY "Enable public file entry" ON case_files FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable admin file access" ON case_files;
CREATE POLICY "Enable admin file access" ON case_files FOR SELECT TO authenticated USING (true);

-- 5. Storage (Automatic Bucket & Policy Setup)
-- Note: Requires 'storage' extensions enabled (standard on Supabase)

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('case_attachments', 'case_attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public to upload (for the intake form)
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'case_attachments');

-- Policy: Allow authenticated users (Admins) to read
DROP POLICY IF EXISTS "Admin Read" ON storage.objects;
CREATE POLICY "Admin Read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'case_attachments');
