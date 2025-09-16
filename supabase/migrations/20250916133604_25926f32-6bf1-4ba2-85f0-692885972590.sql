-- Create a function to assign admin role to the first user
CREATE OR REPLACE FUNCTION public.assign_admin_to_first_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is the first user by counting existing profiles
  IF (SELECT COUNT(*) FROM public.profiles) = 1 THEN
    -- Assign admin role to the first user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically assign admin role to the first user
DROP TRIGGER IF EXISTS assign_admin_to_first_user_trigger ON public.profiles;
CREATE TRIGGER assign_admin_to_first_user_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_admin_to_first_user();

-- Also create a manual function to assign admin role to a specific user
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_record auth.users%ROWTYPE;
BEGIN
  -- Find the user by email
  SELECT * INTO user_record
  FROM auth.users
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE NOTICE 'User with email % not found', user_email;
    RETURN FALSE;
  END IF;
  
  -- Insert admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_record.id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE 'Admin role assigned to user %', user_email;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;