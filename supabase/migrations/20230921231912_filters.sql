CREATE OR REPLACE FUNCTION update_transactions_for_deleted_global_filter()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE plaid_transactions
  SET category = 'test'
  WHERE global_filter_id = OLD.id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_insert_global_plaid_filter
  AFTER INSERT ON global_plaid_filters
    FOR EACH ROW
      EXECUTE FUNCTION update_transactions_for_new_global_filter();
