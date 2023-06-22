DROP TABLE IF EXISTS public.users CASCADE;

DROP TYPE IF EXISTS role_type;
CREATE TYPE role_type AS enum ('user', 'admin');

/**
  * This table is used to store user data that is not provided by Supabase Auth.
  * It is linked to the auth.users table via the id column.
  */
CREATE TABLE users (
  id uuid PRIMARY KEY NOT NULL,
  name text NOT NULL,
  role role_type NOT NULL DEFAULT 'user'::role_type,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Can view own user data." ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Can update own user data." ON users
  FOR UPDATE
  WITH CHECK (auth.uid() = id AND role = users.role);

-- Function that creates a user in our users table when a new user is created in auth.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY definer;

-- Trigger that calls the function above
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE handle_new_user();
