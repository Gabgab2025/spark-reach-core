-- Check if trigger exists and create it if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'on_auth_user_created'
        AND event_object_schema = 'auth'
        AND event_object_table = 'users'
    ) THEN
        -- Create the trigger if it doesn't exist
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;