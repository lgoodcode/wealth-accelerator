

-- Only allow the "name" column to be updated
CREATE OR REPLACE FUNCTION handle_update_global_plaid_filter()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id <> OLD.id THEN
    RAISE EXCEPTION 'Updating "id" is not allowed';
  END IF;
  IF NEW.filter <> OLD.filter THEN
    RAISE EXCEPTION 'Updating "filter" is not allowed';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION handle_update_global_plaid_filter() OWNER TO postgres;

DROP TRIGGER IF EXISTS on_update_global_plaid_filter ON global_plaid_filters;
CREATE TRIGGER on_update_global_plaid_filter
  BEFORE UPDATE ON global_plaid_filters
    FOR EACH ROW
      EXECUTE PROCEDURE handle_update_global_plaid_filter();
