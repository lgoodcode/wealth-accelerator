DROP TRIGGER if exists on_insert_global_plaid_filter on global_plaid_filters;
DROP TRIGGER if exists on_delete_global_plaid_filter on global_plaid_filters;
DROP TRIGGER if exists on_update_global_plaid_filter on global_plaid_filters;
drop function update_transactions_for_new_global_plaid_filter;
drop function update_transactions_for_deleted_global_plaid_filter;
drop function update_transactions_for_updated_global_plaid_filter;
drop function handle_update_global_plaid_filter;

CREATE OR REPLACE FUNCTION create_global_plaid_filter(
  _filter global_plaid_filters,
  override boolean
)
RETURNS global_plaid_filters AS $$
DECLARE
  new_filter global_plaid_filters;
BEGIN
  INSERT INTO global_plaid_filters (filter, category)
  VALUES (_filter.filter, _filter.category)
  RETURNING * INTO new_filter;

  -- Create a temporary table of transaction id's that match the filter, don't already
  -- have a user filter applied, and if the override flag is set, include transactions
  -- that have a global filter, otherwise, skip those
  CREATE TEMP TABLE temp_transactions AS
  SELECT pt.id
  FROM plaid_transactions pt
  JOIN plaid p ON p.item_id = pt.item_id
  WHERE
    pt.user_filter_id IS NULL
    AND CASE
      WHEN override = FALSE THEN pt.global_filter_id IS NULL
      ELSE TRUE
    END
    AND LOWER(pt.name) LIKE '%' || LOWER(_filter.filter) || '%';

  UPDATE plaid_transactions pt
  SET category = _filter.category,
    global_filter_id = new_filter.id
  FROM temp_transactions tt
  WHERE pt.id = tt.id;

  DROP TABLE temp_transactions;
  RETURN new_filter;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION create_global_plaid_filter(
  _filter global_plaid_filters,
  override boolean
) OWNER TO postgres;


-- Only allow the "category" column to be updated and update the transactions
-- that use this filter is connected to
CREATE OR REPLACE FUNCTION update_global_plaid_filter()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id <> OLD.id THEN
    RAISE EXCEPTION 'Updating "id" is not allowed';
  END IF;
  IF NEW.filter <> OLD.filter THEN
    RAISE EXCEPTION 'Updating "filter" is not allowed';
  END IF;

  UPDATE plaid_transactions
  SET category = NEW.category
  WHERE global_filter_id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION update_global_plaid_filter() OWNER TO postgres;

DROP TRIGGER IF EXISTS on_update_global_plaid_filter ON global_plaid_filters;
CREATE TRIGGER on_update_global_plaid_filter
  BEFORE UPDATE ON global_plaid_filters
    FOR EACH ROW
      EXECUTE FUNCTION update_global_plaid_filter();
