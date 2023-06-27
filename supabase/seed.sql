
/**
 * users table
 *
 * This table is used to store user data that is not provided by Supabase Auth.
 * It is linked to the auth.users table via the id column.
 */

DROP TYPE IF EXISTS role_type CASCADE;
CREATE TYPE role_type AS enum ('user', 'admin');

DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE users (
  id uuid PRIMARY KEY NOT NULL REFERENCES auth.users,
  name text NOT NULL,
  role role_type NOT NULL DEFAULT 'user'::role_type,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own user data" ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Can update own user data" ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
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



/**
 * peronal_finance table
 * index_fund_rates table
 */

-- Function that generates the rates array of 60 smallints with a default value of 7
-- and divide the value by 100 when displaying/using it
CREATE OR REPLACE FUNCTION generate_rates() RETURNS smallint[] AS $$
BEGIN
    RETURN ARRAY(SELECT 7::smallint FROM generate_series(1, 60));
END
$$ LANGUAGE plpgsql;

DROP TABLE IF EXISTS personal_finance CASCADE;
CREATE TABLE personal_finance (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  -- Strategy start date
  start_date timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  -- Index fund rates
  rates smallint[] NOT NULL DEFAULT generate_rates(), -- generates an array of 60 smallints with a default value of 7
  -- Wealth accelerator
  stop_invest smallint NOT NULL DEFAULT 10,
  start_withdrawl smallint NOT NULL DEFAULT 20,
  money_needed_to_live int NOT NULL DEFAULT 100000,
  tax_bracket smallint NOT NULL DEFAULT 25,
  tax_bracket_future smallint NOT NULL DEFAULT 30,
  premium_deposit int NOT NULL DEFAULT 50000
);

ALTER TABLE public.personal_finance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own upersonal_financeser data" ON public.personal_finance
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Can update own personal_finance data" ON public.personal_finance
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function that creates a personal_finance row when a new user is created in public.users
CREATE OR REPLACE FUNCTION handle_init_personal_finance()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new row into the personal_finance table for the new user
  INSERT INTO public.personal_finance (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY definer;

-- Trigger the function above when a new user is created
DROP TRIGGER IF EXISTS on_user_created_init_personal_finance ON public.users;
CREATE TRIGGER on_user_created_init_personal_finance
  AFTER INSERT ON public.users
  FOR EACH ROW
    EXECUTE FUNCTION handle_init_personal_finance();



/**
 * plaid table
 *
 * The main Plaid table containing the user's Plaid access tokens for each item.
 */
CREATE TABLE plaid (
  item_id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  access_token text NOT NULL,
  expiration timestamp with time zone NOT NULL,
  cursor text -- used to track last transactions synced
);

ALTER TABLE public.plaid ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own institution data" ON public.plaid
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Can insert new institutions" ON public.plaid
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Can update own institution data" ON public.plaid
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Can delete own institutions" ON public.plaid
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


/**
 *  plaid_accounts table
 */

DROP TYPE IF EXISTS account_type CASCADE;
CREATE TYPE account_type AS enum ('personal', 'business');

CREATE TABLE plaid_accounts (
  account_id text PRIMARY KEY,
  item_id text NOT NULL REFERENCES plaid(item_id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'business'::account_type,
  enabled boolean NOT NULL DEFAULT true
);

ALTER TABLE public.plaid_accounts ENABLE ROW LEVEL SECURITY;

-- Because the user_id is not stored in the plaid_accounts table, we need to join the plaid table

CREATE POLICY "Can view own plaid accounts data" ON public.plaid_accounts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM plaid WHERE plaid.item_id = plaid_accounts.item_id AND plaid.user_id = auth.uid()
    )
  );

CREATE POLICY "Can insert own plaid accounts" ON public.plaid_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM plaid WHERE plaid.item_id = plaid_accounts.item_id AND plaid.user_id = auth.uid()
    )
  );

CREATE POLICY "Can update own plaid accounts data" ON public.plaid_accounts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM plaid WHERE plaid.item_id = plaid_accounts.item_id AND plaid.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM plaid WHERE plaid.item_id = plaid_accounts.item_id AND plaid.user_id = auth.uid()
    )
  );

CREATE POLICY "Can delete own plaid accounts" ON public.plaid_accounts
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM plaid WHERE plaid.item_id = plaid_accounts.item_id AND plaid.user_id = auth.uid()
    )
  );
