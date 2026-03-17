-- Internship Applications Table
CREATE TABLE IF NOT EXISTS public.internship_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    internship_id UUID REFERENCES public.career_internships(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    university TEXT,
    major TEXT,
    linkedin_url TEXT,
    resume_url TEXT,
    cover_letter TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit an application
CREATE POLICY "Public can submit applications" 
ON public.internship_applications FOR INSERT 
WITH CHECK (true);

-- Allow admins to view/manage all applications
CREATE POLICY "Admins can manage applications" 
ON public.internship_applications FOR ALL 
USING (auth.role() = 'authenticated');
