CREATE OR REPLACE FUNCTION update_transactions_for_deleted_global_filter()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE plaid_transactions
  SET category = CASE
    WHEN amount < 0 THEN 'Money-In'::category
    ELSE 'Money-Out'::category
  END
  WHERE global_filter_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER FUNCTION update_transactions_for_deleted_global_filter() OWNER TO postgres;

DROP TRIGGER IF EXISTS on_delete_global_plaid_filter ON global_plaid_filters;
CREATE TRIGGER on_delete_global_plaid_filter
  BEFORE DELETE ON global_plaid_filters
    FOR EACH ROW
      EXECUTE FUNCTION update_transactions_for_deleted_global_filter();
