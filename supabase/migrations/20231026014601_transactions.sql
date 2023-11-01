CREATE TYPE ccf_plaid_transaction AS (
  id text,
  item_id text,
  name text,
  amount numeric,
  category text,
  date  timestamp with time zone
);

CREATE OR REPLACE FUNCTION get_ccf_transactions_by_user_id(user_id uuid)
RETURNS TABLE (
  personal ccf_plaid_transaction[],
  business ccf_plaid_transaction[]
) AS $$
DECLARE
  personal ccf_plaid_transaction[];
  business ccf_plaid_transaction[];
BEGIN
  SELECT COALESCE(
    array_agg(
      ROW(
        pt.id,
        pt.item_id,
        pt.name,
        pt.amount,
        pt.category,
        pt.date
      )::ccf_plaid_transaction
    ),
    ARRAY[]::ccf_plaid_transaction[]
  ) INTO personal
  FROM plaid_transactions pt
    INNER JOIN plaid_accounts pa ON pt.account_id = pa.account_id
    INNER JOIN plaid p ON p.item_id = pa.item_id
    INNER JOIN users u ON u.id = p.user_id
  WHERE
    pa.type IN ('personal', 'waa') AND
    u.id = $1 AND
    pa.enabled = true;

  SELECT COALESCE(
    array_agg(
      ROW(
        pt.id,
        pt.item_id,
        pt.name,
        pt.amount,
        pt.category,
        pt.date
      )::ccf_plaid_transaction
    ),
    ARRAY[]::ccf_plaid_transaction[]
  ) INTO business
  FROM plaid_transactions pt
    INNER JOIN plaid_accounts pa ON pt.account_id = pa.account_id
    INNER JOIN plaid p ON p.item_id = pa.item_id
    INNER JOIN users u ON u.id = p.user_id
  WHERE
    pa.type = 'business' AND
    u.id = $1 AND
    pa.enabled = true;

  RETURN QUERY SELECT personal, business;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER FUNCTION get_ccf_transactions_by_user_id(user_id uuid) OWNER TO postgres;
