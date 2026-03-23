-- 1. Upgrade Profiles Roles
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'staff', 'client', 'member'));

-- 2. Link Cases to Clients
ALTER TABLE cases ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3. Update Case RLS Policies for Clients
-- Allow clients to view their own cases
DROP POLICY IF EXISTS "Clients can view own cases" ON cases;
CREATE POLICY "Clients can view own cases" ON cases 
  FOR SELECT USING (auth.uid() = client_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Allow clients to insert cases and auto-link their ID
DROP POLICY IF EXISTS "Clients can insert own cases" ON cases;
CREATE POLICY "Clients can insert own cases" ON cases 
  FOR INSERT WITH CHECK (client_id = auth.uid() OR client_id IS NULL);

-- 4. Setup Secure Document Vault
INSERT INTO storage.buckets (id, name, public)
VALUES ('client_vault', 'client_vault', false)
ON CONFLICT (id) DO NOTHING;

-- Client Vault RLS: Users can only upload and read files in their own folder (e.g., client_vault/USER_ID/*)
DROP POLICY IF EXISTS "Clients can upload to own vault folder" ON storage.objects;
CREATE POLICY "Clients can upload to own vault folder" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'client_vault' AND auth.uid()::text = (string_to_array(name, '/'))[1]);

DROP POLICY IF EXISTS "Clients can view own vault folder" ON storage.objects;
CREATE POLICY "Clients can view own vault folder" ON storage.objects 
  FOR SELECT USING (bucket_id = 'client_vault' AND auth.uid()::text = (string_to_array(name, '/'))[1]);

-- Admins can view and upload to any vault folder
DROP POLICY IF EXISTS "Admins can view all vaults" ON storage.objects;
CREATE POLICY "Admins can view all vaults" ON storage.objects 
  FOR SELECT USING (bucket_id = 'client_vault' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can upload to any vault" ON storage.objects;
CREATE POLICY "Admins can upload to any vault" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'client_vault' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 5. Network Applications Integration
ALTER TABLE network_applications ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Enable members to read/update their own approved profiles
ALTER TABLE network_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can edit own profile" ON network_applications;
CREATE POLICY "Members can edit own profile" ON network_applications 
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Members can view own profile" ON network_applications;
CREATE POLICY "Members can view own profile" ON network_applications 
  FOR SELECT USING (auth.uid() = user_id OR status = 'approved');

-- 6. Trigger to automatically create profiles for new signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, COALESCE(new.raw_user_meta_data->>'role', 'client'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create the trigger securely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
