-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Leadership Team Table
CREATE TABLE IF NOT EXISTS public.site_leadership (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio_summary TEXT,
    bio_full TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    linkedin_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_leadership ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Public can view leadership" ON public.site_leadership;
CREATE POLICY "Public can view leadership" 
ON public.site_leadership FOR SELECT 
USING (is_active = true);

-- Allow authenticated admins to manage everything
DROP POLICY IF EXISTS "Admins can manage leadership" ON public.site_leadership;
CREATE POLICY "Admins can manage leadership" 
ON public.site_leadership FOR ALL 
USING (auth.role() = 'authenticated');
