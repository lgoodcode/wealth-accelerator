CREATE OR REPLACE FUNCTION update_transactions_for_updated_global_filter()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE plaid_transactions
  SET category = NEW.category
  WHERE global_filter_id = NEW.id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION update_transactions_for_updated_global_filter() OWNER TO postgres;

DROP TRIGGER IF EXISTS on_delete_global_plaid_filter ON global_plaid_filters;
CREATE TRIGGER on_delete_global_plaid_filter
  AFTER UPDATE ON global_plaid_filters
    FOR EACH ROW
      EXECUTE FUNCTION update_transactions_for_updated_global_filter();
