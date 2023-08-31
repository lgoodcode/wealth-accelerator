UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data,
  '{role}',
  '"USER"',
  true
);

UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data,
  '{role}',
  '"ADMIN"',
  true
)
WHERE id = '04b9a09f-dad2-4013-a28b-b2771c5bba03' OR '8d18fc14-2a51-44cc-8273-2e5ecb0718e7';


CREATE OR REPLACE FUNCTION get_auth_users()
RETURNS TABLE (
  id uuid,
  name text,
  email text,
  role user_role,
  confirmed_email boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
    SELECT
      u.id,
      u.raw_user_meta_data->>'name' AS name,
      u.email::text,
      COALESCE(UPPER(u.raw_user_meta_data->>'role')::user_role, 'USER'::user_role) AS role, -- I don't know why but it won't work without COALESCE
      (u.email_confirmed_at IS NOT NULL) AS confirmed_email,
      u.created_at,
      u.updated_at
    FROM
      auth.users u
    ORDER BY
      u.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION get_auth_users() OWNER TO postgres;
