CREATE TABLE balances_accounts (
  id int PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_balances_accounts_user_id ON balances_accounts(user_id);

ALTER TABLE balances_accounts OWNER TO postgres;
ALTER TABLE balances_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own balance accounts" ON balances_accounts
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Can insert new balance accounts" ON balances_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Can update own debt balance accounts" ON balances_accounts
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Can delete own balance accounts" ON balances_accounts
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);



/**
 * Ensure that there are no duplicate account names for the same user
 */
CREATE OR REPLACE FUNCTION verify_balances_accounts()
RETURNS TRIGGER AS $$
DECLARE
  duplicate_count INT;
BEGIN
  SELECT COUNT(*) INTO duplicate_count
  FROM balances_accounts ba
  WHERE ba.user_id = NEW.user_id
    AND LOWER(ba.name) = LOWER(NEW.name)
    AND ba.id != NEW.id;

  IF duplicate_count > 0 THEN
    RAISE EXCEPTION 'Duplicate account name for the same user is not allowed';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION verify_balances_accounts() OWNER TO postgres;

DROP TRIGGER IF EXISTS on_insert_or_update_balances_accounts ON balances_accounts;
CREATE TRIGGER on_insert_or_update_balances_accounts
  BEFORE INSERT OR UPDATE ON balances_accounts
    FOR EACH ROW
      EXECUTE FUNCTION verify_balances_accounts();



/**
 * Entries for balances_accounts
 */
CREATE TABLE balances_entries (
  id int PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  account_id int REFERENCES balances_accounts(id) ON DELETE CASCADE NOT NULL,
  date timestamp with time zone NOT NULL,
  amount numeric(12,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_balances_entries_account_id ON balances_entries(account_id);

ALTER TABLE balances_entries OWNER TO postgres;
ALTER TABLE balances_entries ENABLE ROW LEVEL SECURITY;

-- Because the user_id is not stored in the balances_entries table, we need to join the balances_accounts table
CREATE OR REPLACE FUNCTION is_own_balances_entry(account_id int)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM balances_accounts ba
    WHERE ba.id = account_id AND ba.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION is_own_balances_entry(int) OWNER TO postgres;

/**
 * For the RLS, we pass in the account_id to the function so it can be used for both
 * insert and update policies. This is because NEW isn't available for the insert policy.
 */
CREATE POLICY "Can view own balance entries" ON balances_entries
  FOR SELECT
  TO authenticated
  USING ((SELECT is_own_balances_entry(account_id)));

-- Using a trigger to verify that the account_id belongs to the user
CREATE POLICY "Can insert new balance entries" ON balances_entries
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_own_balances_entry(account_id)));

CREATE POLICY "Can update own balance entries" ON balances_entries
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_own_balances_entry(account_id)))
  WITH CHECK ((SELECT is_own_balances_entry(account_id)));

CREATE POLICY "Can delete own balance entries" ON balances_entries
  FOR DELETE
  TO authenticated
  USING ((SELECT is_own_balances_entry(account_id)));



CREATE OR REPLACE FUNCTION get_balances_entries(user_id uuid)
RETURNS TABLE (
  id int,
  date timestamp with time zone,
  amount numeric(12,2)
) AS $$
BEGIN
  RETURN QUERY
    SELECT
      be.id,
      be.date,
      be.amount
    FROM balances_entries be
    JOIN balances_accounts ba ON ba.id = be.account_id
    WHERE ba.user_id = $1
    ORDER BY be.date DESC;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION get_balances_entries(user_id uuid) OWNER TO postgres;
