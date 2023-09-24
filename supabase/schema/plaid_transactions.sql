DROP TYPE IF EXISTS category CASCADE;
CREATE TYPE category AS ENUM ('Transfer', 'Money-In', 'Money-Out');
ALTER TYPE category OWNER TO postgres;

DROP TABLE IF EXISTS plaid_transactions CASCADE;
CREATE TABLE plaid_transactions (
  id text PRIMARY KEY, -- the transaction id from Plaid
  item_id text NOT NULL REFERENCES plaid(item_id) ON DELETE CASCADE,
  account_id text NOT NULL REFERENCES plaid_accounts(account_id) ON DELETE CASCADE,
  name text NOT NULL,
  amount numeric(12,2) NOT NULL,
  category category NOT NULL,
  date timestamp with time zone NOT NULL,
  user_filter_id int REFERENCES user_plaid_filters(id) ON DELETE SET NULL,
  global_filter_id int REFERENCES global_plaid_filters(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_plaid_transactions_item_id ON plaid_transactions(item_id);
CREATE INDEX IF NOT EXISTS idx_plaid_transactions_account_id ON plaid_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_plaid_transactions_user_filter_id ON plaid_transactions(user_filter_id);
CREATE INDEX IF NOT EXISTS idx_plaid_transactions_global_filter_id ON plaid_transactions(global_filter_id);

ALTER TABLE plaid_transactions OWNER TO postgres;
ALTER TABLE plaid_transactions ENABLE ROW LEVEL SECURITY;

-- Because the user_id is not stored in the plaid_accounts table, we need to join the plaid table
CREATE OR REPLACE FUNCTION is_own_plaid_transaction()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM plaid p
    WHERE p.item_id = item_id AND p.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION is_own_plaid_transaction() OWNER TO postgres;

CREATE POLICY "Can view own plaid transactions" ON public.plaid_transactions
  FOR SELECT
  TO authenticated
  USING (is_own_plaid_transaction());

CREATE POLICY "Can insert own plaid transactions" ON public.plaid_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (is_own_plaid_transaction());

CREATE POLICY "Can update own plaid transactions" ON public.plaid_transactions
  FOR UPDATE
  TO authenticated
  USING (is_own_plaid_transaction());

CREATE POLICY "Can delete own plaid transactions" ON public.plaid_transactions
  FOR DELETE
  TO authenticated
  USING (is_own_plaid_transaction());

-- Function that formats a transaction that is being inserted
CREATE OR REPLACE FUNCTION format_transaction()
RETURNS TRIGGER AS $$
BEGIN
  NEW.date = NEW.date + INTERVAL '7 hours'; -- Add 7 hours to get it to proper UTC time format
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION format_transaction() OWNER TO postgres;

-- Trigger to format the transactions date whenever a new transaction is inserted
DROP TRIGGER IF EXISTS on_insert_plaid_transactions ON public.plaid_transactions;
CREATE TRIGGER on_insert_plaid_transactions
  BEFORE INSERT ON public.plaid_transactions
    FOR EACH ROW
      EXECUTE FUNCTION format_transaction();
