-- Used to check if an email is used when inviting users in the Manager Users section
CREATE OR REPLACE FUNCTION is_email_used(email text)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM auth.users as a WHERE a.email = $1);
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION is_email_used(email text) OWNER TO postgres;



CREATE OR REPLACE FUNCTION get_transactions_with_account_name(ins_item_id text, offset_val int, limit_val int)
RETURNS TABLE (
    id text,
    item_id text,
    account_id text,
    name text,
    amount numeric(12,2),
    category category,
    date timestamp with time zone,
    account text
) AS $$
BEGIN
    RETURN QUERY
        SELECT
            t.id,
            t.item_id,
            t.account_id,
            t.name,
            t.amount,
            t.category,
            t.date,
            a.name AS account
        FROM
            plaid_transactions t
        INNER JOIN
            plaid_accounts a ON t.account_id = a.account_id
        WHERE
            t.item_id = ins_item_id AND a.enabled = true
        ORDER BY
            t.date DESC
        OFFSET
            offset_val
        LIMIT
            limit_val;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION get_transactions_with_account_name(
  ins_item_id text,
  offset_val int,
  limit_val int
) OWNER TO postgres;


-- Retrieves all transactions for all accounts for the user except for transactions
-- from accounts that are disabled and returns them in a JSON object with the
-- following structure:
-- {
--   "personal": Transaction[],
--   "business": Transaction[]
-- }
CREATE OR REPLACE FUNCTION get_transactions_by_user_id(user_id uuid)
RETURNS JSON AS $$
DECLARE
  personal_transactions JSON;
  business_transactions JSON;
BEGIN
  SELECT COALESCE(
    json_agg(
      json_build_object(
        'id', pt.id,
        'item_id', pt.item_id,
        'name', pt.name,
        'amount', pt.amount,
        'category', pt.category,
        'date', pt.date
      )
    ),
    '[]'::JSON
  ) INTO personal_transactions
  FROM plaid_transactions pt
    INNER JOIN plaid_accounts pa ON pt.account_id = pa.account_id
    INNER JOIN plaid p ON p.item_id = pa.item_id
    INNER JOIN users u ON u.id = p.user_id
  WHERE
    pa.type IN ('personal', 'waa') AND
    u.id = $1 AND
    pa.enabled = true;

  SELECT COALESCE(
    json_agg(
      json_build_object(
        'id', pt.id,
        'item_id', pt.item_id,
        'name', pt.name,
        'amount', pt.amount,
        'category', pt.category,
        'date', pt.date
      )
    ),
    '[]'::JSON
  ) INTO business_transactions
  FROM plaid_transactions pt
    INNER JOIN plaid_accounts pa ON pt.account_id = pa.account_id
    INNER JOIN plaid p ON p.item_id = pa.item_id
    INNER JOIN users u ON u.id = p.user_id
  WHERE
    pa.type = 'business' AND
    u.id = $1 AND
    pa.enabled = true;

  RETURN json_build_object(
    'personal', personal_transactions,
    'business', business_transactions
  );
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION public.get_transactions_by_user_id(user_id uuid) OWNER TO postgres;



-- Updates a user's profile by first checking if the provided email is already in use and if it
-- is then it throws an exception. If it isn't then it updates the user's email and name. In
-- both the auth.users and public.users tables for emails and name in public.users.
CREATE OR REPLACE function update_user_profile(new_name text, new_email text)
RETURNS JSON AS $$
DECLARE
  user_id uuid;
BEGIN
  user_id := auth.uid();

  -- Check if the email is already in use
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = new_email AND id != user_id) THEN
    RAISE EXCEPTION 'Email already in use';
  END IF;

  -- Update the user's profile
  UPDATE auth.users SET email = LOWER(new_email) WHERE id = user_id;
  UPDATE public.users SET name = INITCAP(new_name), email = LOWER(new_email) WHERE id = user_id;

  -- Return the updated user's profile
  RETURN (SELECT row_to_json(u) FROM (SELECT name, email FROM public.users WHERE id = user_id) u);
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION update_user_profile(new_name text, new_email text) OWNER TO postgres;



-- Changes a user password by first checking if the provided current password matches and if it
-- doesn't then it throws an exception. If it does match then it updates the user's password
-- with the new one.
CREATE OR REPLACE function change_user_password(current_password text, new_password text)
RETURNS VOID AS $$
DECLARE
  user_id uuid;
BEGIN
  user_id := auth.uid();

  -- Check if the passwords match
  IF EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = user_id AND encrypted_password = crypt(current_password::text, auth.users.encrypted_password)
  ) THEN
    RAISE EXCEPTION 'Incorrect password';
  END IF;

  -- Then set the new password
  UPDATE auth.users SET encrypted_password = crypt(new_password, gen_salt('bf'))
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION change_user_password(current_password text, new_password text) OWNER TO postgres;



-- Checks if an email is in the auth.users table, when inviting users to prevent duplicate emails
CREATE OR REPLACE FUNCTION is_email_used(email text)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM auth.users as a WHERE a.email = $1);
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION is_email_used(email text) OWNER TO postgres;



-- Retrieves the users from the auth.users table for the Manage Users
CREATE OR REPLACE FUNCTION get_manage_users()
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
      u.name,
      u.email,
      u.role,
      (au.email_confirmed_at IS NOT NULL),
      u.created_at,
      u.updated_at
    FROM public.users u
    JOIN auth.users au ON u.id = au.id
    ORDER BY
      u.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION get_manage_users() OWNER TO postgres;
