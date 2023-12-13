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
 * Ensure that there are no duplicate account names for the same user
 */
CREATE OR REPLACE FUNCTION verify_update_plaid_accounts()
RETURNS TRIGGER AS $$
DECLARE
  duplicate_count INT;
BEGIN
  -- Check for duplicates using the indexed item_id first
  SELECT COUNT(*) INTO duplicate_count
  FROM plaid_accounts pa
  WHERE pa.item_id = NEW.item_id
    AND LOWER(pa.name) = LOWER(NEW.name)
    AND pa.account_id != NEW.account_id;

  IF duplicate_count > 0 THEN
    RAISE EXCEPTION 'Duplicate account name for the same user is not allowed';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER FUNCTION verify_update_plaid_accounts() OWNER TO postgres;

DROP TRIGGER IF EXISTS on_update_plaid_accounts ON plaid_accounts;
CREATE TRIGGER on_update_plaid_accounts
  BEFORE UPDATE ON plaid_accounts
    FOR EACH ROW
      EXECUTE FUNCTION verify_update_plaid_accounts();



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



-- Retrieves the WAA account ID and item ID for a given user
CREATE OR REPLACE FUNCTION get_waa_account_id()
RETURNS TABLE (account_id TEXT, item_id TEXT) AS $$
DECLARE
  subquery_result INTEGER;
BEGIN
  -- Define the temporary table to store the results of the CTE
  CREATE TEMPORARY TABLE waa_accounts_temp AS (
    SELECT p.item_id, pa.account_id
    FROM plaid_accounts pa
    JOIN plaid p ON p.item_id = pa.item_id
    WHERE pa.type = 'waa' AND p.user_id = auth.uid()
    LIMIT 2 -- Limit to 2 because an exception will be raised if more than 1 is found
  );

  -- Check the number of rows returned by the subquery
  SELECT COUNT(*) INTO subquery_result FROM waa_accounts_temp;
  IF subquery_result = 0 THEN
    RAISE EXCEPTION 'No WAA account found';
  ELSIF subquery_result > 1 THEN
    RAISE EXCEPTION 'Multiple WAA accounts found';
  END IF;

  RETURN QUERY SELECT waa_accounts_temp.account_id, waa_accounts_temp.item_id FROM waa_accounts_temp LIMIT 1;

  DROP TABLE waa_accounts_temp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER FUNCTION get_waa_account_id() OWNER TO postgres;



CREATE TYPE add_plaid_account_type AS (id text, name text);
-- Only insert the account if the account_id doesn't exist in the plaid_accounts table
-- for the given item_id
CREATE OR REPLACE FUNCTION add_plaid_accounts(item_id text, accounts add_plaid_account_type[])
RETURNS BOOLEAN AS $$
DECLARE
  account add_plaid_account_type;
  was_added BOOLEAN := FALSE;
BEGIN
  FOREACH account IN ARRAY accounts LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM plaid_accounts pa
      WHERE pa.account_id = account.id AND pa.item_id = $1
    ) THEN
      INSERT INTO plaid_accounts (account_id, item_id, name, type)
      VALUES (account.id, $1, account.name, 'business'::plaid_account_type);
      was_added := TRUE;
    END IF;
  END LOOP;

  -- Update the institution so it doesn't trigger the accounts update mode anymore
  IF was_added THEN
    UPDATE plaid p
    SET new_accounts = FALSE
    WHERE p.item_id = $1;
  END IF;

  RETURN was_added;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION add_plaid_accounts(
  item_id text,
  accounts add_plaid_account_type[]
) OWNER TO postgres;

