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




-- When a user filter is deleted, if the user selected a global filter to use,
-- then we will update the transactions to use the global filter instead.
CREATE OR REPLACE FUNCTION delete_user_plaid_filter(filter_id int, global_filter_id int DEFAULT NULL)
RETURNS VOID AS $$
DECLARE
  global_filter global_plaid_filters;
BEGIN
  IF global_filter_id IS NOT NULL THEN
    SELECT * FROM global_plaid_filters WHERE id = global_filter_id INTO global_filter;

    UPDATE plaid_transactions
    SET
      category = global_filter.category,
      global_filter_id = global_filter.id
    WHERE user_filter_id = filter_id;
  ELSE
    UPDATE plaid_transactions
    SET
      category = CASE
        WHEN amount < 0 THEN 'Money-In'::category
        ELSE 'Money-Out'::category
      END,
      global_filter_id = NULL
    WHERE user_filter_id = filter_id;
  END IF;

  DELETE FROM user_plaid_filters WHERE id = filter_id;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION delete_user_plaid_filter(
  filter_id int,
  global_filter_id int
) OWNER TO postgres;
