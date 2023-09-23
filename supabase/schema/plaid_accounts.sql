DROP TYPE IF EXISTS account_type CASCADE;
CREATE TYPE account_type AS enum ('personal', 'business');
ALTER TYPE account_type OWNER TO postgres;

DROP TABLE IF EXISTS plaid_accounts CASCADE;
CREATE TABLE plaid_accounts (
  account_id text PRIMARY KEY,
  item_id text NOT NULL REFERENCES plaid(item_id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'business'::account_type,
  enabled boolean NOT NULL DEFAULT true
);

ALTER TABLE plaid_accounts OWNER TO postgres;
ALTER TABLE plaid_accounts ENABLE ROW LEVEL SECURITY;

-- Because the user_id is not stored in the plaid_accounts table, we need to join the plaid table
CREATE OR REPLACE FUNCTION is_own_plaid_account()
RETURNS BOOL AS $$
BEGIN
  PERFORM
  FROM plaid as p
  WHERE p.item_id = item_id AND p.user_id = auth.uid();
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION is_own_plaid_account() OWNER TO postgres;

CREATE POLICY "Can view own plaid accounts data" ON public.plaid_accounts
  FOR SELECT
  TO authenticated
  USING (is_own_plaid_account());

CREATE POLICY "Can insert own plaid accounts" ON public.plaid_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (is_own_plaid_account());

CREATE POLICY "Can update own plaid accounts data" ON public.plaid_accounts
  FOR UPDATE
  TO authenticated
  USING (is_own_plaid_account());

CREATE POLICY "Can delete own plaid accounts" ON public.plaid_accounts
  FOR DELETE
  TO authenticated
  USING (is_own_plaid_account());
