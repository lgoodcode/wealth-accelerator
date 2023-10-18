DROP TYPE IF EXISTS plaid_account_type CASCADE;
CREATE TYPE plaid_account_type AS enum ('personal', 'business', 'waa');
ALTER TYPE plaid_account_type OWNER TO postgres;

DROP TABLE IF EXISTS plaid_accounts CASCADE;
CREATE TABLE plaid_accounts (
  account_id text PRIMARY KEY,
  item_id text NOT NULL REFERENCES plaid(item_id) ON DELETE CASCADE,
  name text NOT NULL,
  type plaid_account_type NOT NULL,
  enabled boolean NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_plaid_accounts_item_id ON plaid_accounts(item_id);

ALTER TABLE plaid_accounts OWNER TO postgres;
ALTER TABLE plaid_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own plaid accounts" ON plaid_accounts
  FOR SELECT
  TO authenticated
  USING ((SELECT is_own_plaid_account()));

CREATE POLICY "Can insert own plaid accounts" ON plaid_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_own_plaid_account()));

CREATE POLICY "Can update own plaid accounts" ON plaid_accounts
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_own_plaid_account()))
  WITH CHECK ((SELECT is_own_plaid_account()));

CREATE POLICY "Can delete own plaid accounts" ON plaid_accounts
  FOR DELETE
  TO authenticated
  USING ((SELECT is_own_plaid_account()));



/**
 *  plaid_accounts functions
 */

-- Because the user_id is not stored in the plaid_accounts table, we need to join the plaid table
CREATE OR REPLACE FUNCTION is_own_plaid_account()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM plaid p
    WHERE p.item_id = item_id AND p.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION is_own_plaid_account() OWNER TO postgres;


-- Retrieves the WAA account ID for a given user
CREATE OR REPLACE FUNCTION get_waa_account_id()
RETURNS TEXT AS $$
DECLARE
    v_account_ids TEXT[];
BEGIN
    -- Try to select the accounts
    SELECT ARRAY_AGG(account_id) INTO v_account_ids FROM plaid_accounts pa
    JOIN plaid p ON p.item_id = pa.item_id
    WHERE pa.type = 'waa' AND p.user_id = auth.uid()
    LIMIT 2; -- Limit to 2 because an exception will be raised if more than 1 is found

    IF v_account_ids IS NULL THEN
        RAISE EXCEPTION 'No WAA account found';
    ELSIF array_length(v_account_ids, 1) > 1 THEN
        RAISE EXCEPTION 'Multiple WAA accounts found';
    ELSE
        RETURN v_account_ids[1];
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER FUNCTION get_waa_account_id() OWNER TO postgres;
