-- Careers & Mentorship Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Legal Internships
CREATE TABLE IF NOT EXISTS public.career_internships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Internship',
    description TEXT,
    requirements TEXT[],
    apply_link TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Mentorship Programs
CREATE TABLE IF NOT EXISTS public.mentorship_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_name TEXT NOT NULL,
    expertise TEXT NOT NULL,
    location TEXT NOT NULL,
    bio TEXT,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Training Resources
CREATE TABLE IF NOT EXISTS public.training_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    resource_type TEXT NOT NULL, -- Guide, Webinar, Course, etc.
    description TEXT,
    image_url TEXT,
    link_url TEXT, -- External link or file path
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.career_internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_resources ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read for career_internships" ON public.career_internships FOR SELECT USING (true);
CREATE POLICY "Public read for mentorship_programs" ON public.mentorship_programs FOR SELECT USING (true);
CREATE POLICY "Public read for training_resources" ON public.training_resources FOR SELECT USING (true);

-- Admin CRUD access (assuming 'admin' role or similar)
-- For now, allowing all for testing, but in production, this should be restricted
CREATE POLICY "Admin full access for career_internships" ON public.career_internships FOR ALL USING (true);
CREATE POLICY "Admin full access for mentorship_programs" ON public.mentorship_programs FOR ALL USING (true);
CREATE POLICY "Admin full access for training_resources" ON public.training_resources FOR ALL USING (true);

-- Sample Data
INSERT INTO public.career_internships (title, company, location, type, description)
VALUES 
('Summer Legal Intern', 'Pan-Afric Law Firm', 'Addis Ababa, Ethiopia', 'Summer Internship', 'Join our corporate law team for an intensive 3-month summer internship program.');

INSERT INTO public.mentorship_programs (mentor_name, expertise, location, bio)
VALUES 
('Sarah Mensah', 'Corporate Law', 'Accra, Ghana', 'Veteran corporate lawyer with 20+ years of experience in cross-border trade.');

INSERT INTO public.training_resources (title, resource_type, description)
VALUES 
('Introduction to Pan-African Trade Law', 'Guide', 'A comprehensive guide to the fundamentals of trade law within the AfCFTA framework.');
