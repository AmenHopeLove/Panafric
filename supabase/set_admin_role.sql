-- Update the user profile for 'amenkingdom44@gmail.com' to be an admin
UPDATE public.profiles 
SET role = 'admin', is_admin = true 
WHERE email = 'amenkingdom44@gmail.com';
