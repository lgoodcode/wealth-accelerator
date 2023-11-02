CREATE OR REPLACE FUNCTION verify_update_plaid_accounts()
RETURNS TRIGGER AS $$
DECLARE
  duplicate_count INT;
BEGIN
  SELECT COUNT(*) INTO duplicate_count
  FROM plaid_accounts pa
  JOIN plaid p ON p.item_id = pa.item_id
  WHERE pa.name = NEW.name AND pa.account_id != NEW.account_id;

  IF duplicate_count > 0 THEN
    RAISE EXCEPTION 'Duplicate account name for the same user is not allowed';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION verify_update_plaid_accounts() OWNER TO postgres;

DROP TRIGGER IF EXISTS on_update_plaid_accounts ON plaid_accounts;
CREATE TRIGGER on_update_plaid_accounts
  BEFORE UPDATE ON plaid_accounts
    FOR EACH ROW
      EXECUTE FUNCTION verify_update_plaid_accounts();
