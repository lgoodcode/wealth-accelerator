CREATE OR REPLACE FUNCTION create_user_plaid_filter(
  _filter user_plaid_filters,
  user_override boolean,
  global_override boolean
)
RETURNS user_plaid_filters AS $$
DECLARE
  new_filter user_plaid_filters;
BEGIN
  INSERT INTO user_plaid_filters (user_id, filter, category)
  VALUES (_filter.user_id, _filter.filter, _filter.category)
  RETURNING * INTO new_filter;

  -- Create a temporary table of transaction id's that belong to the user and match the filter
  CREATE TEMP TABLE temp_transactions AS
  SELECT pt.id
  FROM plaid_transactions pt
  JOIN plaid p ON p.item_id = pt.item_id
  WHERE p.user_id = _filter.user_id
    AND LOWER(pt.name) LIKE '%' || LOWER(_filter.filter) || '%';

  -- Override any filter
  IF user_override AND global_override THEN
    UPDATE plaid_transactions pt
    SET category = _filter.category,
      user_filter_id = new_filter.id,
      global_filter_id = NULL
    WHERE pt.id IN (SELECT id FROM temp_transactions);
  -- Override any existing user filter but not existing global
  ELSIF user_override THEN
    UPDATE plaid_transactions pt
    SET category = _filter.category, user_filter_id = new_filter.id
    WHERE global_filter_id IS NULL
      AND pt.id IN (SELECT id FROM temp_transactions);
  -- Override any existing global filter but not existing user
  ELSIF global_override THEN
    UPDATE plaid_transactions pt
    SET category = _filter.category,
      user_filter_id = new_filter.id,
      global_filter_id = NULL
    WHERE user_filter_id IS NULL
      AND pt.id IN (SELECT id FROM temp_transactions);
  -- Only update transactions that don't have a filter
  ELSE
    UPDATE plaid_transactions pt
    SET category = _filter.category, user_filter_id = new_filter.id
    WHERE user_filter_id IS NULL
      AND global_filter_id IS NULL
      AND pt.id IN (SELECT id FROM temp_transactions);
  END IF;

  DROP TABLE temp_transactions;
  RETURN new_filter;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION create_user_plaid_filter(
  _filter user_plaid_filters,
  user_override boolean,
  global_override boolean
) OWNER TO postgres;



-- CREATE OR REPLACE FUNCTION update_transactions_for_new_global_plaid_filter()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   UPDATE plaid_transactions
--   SET category = NEW.category,
--     user_filter_id = NULL,
--     global_filter_id = NEW.id
--   WHERE LOWER(name) LIKE '%' || LOWER(NEW.filter) || '%'
--     AND category IS DISTINCT FROM NEW.category; -- Only update if category is different
--   RETURN NULL;
-- END;
-- $$ LANGUAGE plpgsql SECURITY definer;

-- ALTER FUNCTION update_transactions_for_new_global_plaid_filter() OWNER TO postgres;

-- DROP TRIGGER IF EXISTS on_insert_global_plaid_filter ON global_plaid_filters;
-- CREATE TRIGGER on_insert_global_plaid_filter
--   AFTER INSERT ON global_plaid_filters
--     FOR EACH ROW
--       EXECUTE FUNCTION update_transactions_for_new_global_plaid_filter();

-- -- When a global filter is deleted, update the category of all transactions that were using it
-- CREATE OR REPLACE FUNCTION update_transactions_for_deleted_global_plaid_filter()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   UPDATE plaid_transactions
--   SET category = CASE
--     WHEN amount < 0 THEN 'Money-In'::category
--     ELSE 'Money-Out'::category
--   END
--   WHERE global_filter_id = OLD.id;
--   RETURN OLD;
-- END;
-- $$ LANGUAGE plpgsql;

-- ALTER FUNCTION update_transactions_for_deleted_global_plaid_filter() OWNER TO postgres;

-- DROP TRIGGER IF EXISTS on_delete_global_plaid_filter ON global_plaid_filters;
-- CREATE TRIGGER on_delete_global_plaid_filter
--   BEFORE DELETE ON global_plaid_filters
--     FOR EACH ROW
--       EXECUTE FUNCTION update_transactions_for_deleted_global_plaid_filter();

-- CREATE OR REPLACE FUNCTION update_transactions_for_updated_global_plaid_filter()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   UPDATE plaid_transactions
--   SET category = NEW.category
--   WHERE global_filter_id = NEW.id;
--   RETURN NULL;
-- END;
-- $$ LANGUAGE plpgsql;

-- ALTER FUNCTION update_transactions_for_updated_global_plaid_filter() OWNER TO postgres;

-- DROP TRIGGER IF EXISTS on_delete_global_plaid_filter ON global_plaid_filters;
-- CREATE TRIGGER on_delete_global_plaid_filter
--   AFTER UPDATE ON global_plaid_filters
--     FOR EACH ROW
--       EXECUTE FUNCTION update_transactions_for_updated_global_plaid_filter();

-- -- Only allow the "category" column to be updated
-- CREATE OR REPLACE FUNCTION handle_update_global_plaid_filter()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   IF NEW.id <> OLD.id THEN
--     RAISE EXCEPTION 'Updating "id" is not allowed';
--   END IF;
--   IF NEW.filter <> OLD.filter THEN
--     RAISE EXCEPTION 'Updating "filter" is not allowed';
--   END IF;

--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- ALTER FUNCTION handle_update_global_plaid_filter() OWNER TO postgres;

-- DROP TRIGGER IF EXISTS on_update_global_plaid_filter ON global_plaid_filters;
-- CREATE TRIGGER on_update_global_plaid_filter
--   BEFORE UPDATE ON global_plaid_filters
--     FOR EACH ROW
--       EXECUTE PROCEDURE handle_update_global_plaid_filter();

