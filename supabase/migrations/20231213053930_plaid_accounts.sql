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

