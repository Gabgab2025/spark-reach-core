-- Create the first admin user (you'll need to replace this email with your actual admin email)
-- This is a placeholder - you should update it with your actual admin user email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'admin@callcenterpro.com'
ON CONFLICT (user_id, role) DO NOTHING;