/**
 * users table
 *
 * This table is used to store user data that is not provided by Supabase Auth.
 * It is linked to the auth.users table via the id column.
 */

DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS enum ('USER', 'ADMIN');
ALTER TYPE user_role OWNER TO postgres;

DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role user_role NOT NULL DEFAULT 'USER'::user_role,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.users OWNER TO postgres;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION is_authenticated() OWNER TO postgres;

CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  PERFORM
  FROM public.users
  WHERE id = user_id AND role = 'ADMIN'::user_role;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION is_admin(UUID) OWNER TO postgres;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE auth.uid() = id AND role = 'ADMIN'::user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION is_admin() OWNER TO postgres;

CREATE POLICY "Can view their own data and admins can view all user data" ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR is_admin(auth.uid()));

CREATE POLICY "Can update own user data or admins can update all users data" ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR is_admin(auth.uid()))
  -- WITH CHECK checks the data after modification, so we just check that the role is not changed if the user is not an admin
  WITH CHECK ((auth.uid() = id AND role = users.role) OR is_admin(auth.uid()));

CREATE POLICY "Admins can delete users" ON public.users
  FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Function that creates a user in our users table when a new user is created in auth.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    LOWER(NEW.email),
    INITCAP(NEW.raw_user_meta_data->>'name')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION handle_new_user() OWNER TO postgres;

-- Trigger that calls the function above
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
    FOR EACH ROW
      EXECUTE PROCEDURE handle_new_user();
