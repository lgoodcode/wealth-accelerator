CREATE TYPE temp_role AS enum ('USER', 'ADMIN', 'SUPER_USER');
ALTER TYPE temp_role OWNER TO postgres;


-- CREATE TYPE user_role AS enum ('USER', 'ADMIN', 'SUPER_USER');
-- ALTER TYPE user_role OWNER TO postgres;


CREATE OR REPLACE FUNCTION is_super_user(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users WHERE id = user_id AND role = 'SUPER_USER'::user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION is_super_user(UUID) OWNER TO postgres;
