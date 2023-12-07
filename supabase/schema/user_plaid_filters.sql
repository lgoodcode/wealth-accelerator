CREATE TABLE user_plaid_filters (
  id int PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id uuid NOT NULL REFERENCES public.users(id),
  filter text UNIQUE NOT NULL,
  category category NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_plaid_filters_user_id ON user_plaid_filters(user_id);

ALTER TABLE user_plaid_filters OWNER TO postgres;
ALTER TABLE user_plaid_filters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plaid filters" ON user_plaid_filters
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own plaid filters" ON user_plaid_filters
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own plaid filters" ON user_plaid_filters
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);
  -- WITH CHECK is omitted because the BEFORE UPDATE trigger checks for this
  -- and does other operations

CREATE POLICY "Users can delete own plaid filters" ON user_plaid_filters
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);



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
    FROM temp_transactions tt
    WHERE pt.id = tt.id;
  -- Override any existing user filter but not existing global
  ELSIF user_override THEN
    UPDATE plaid_transactions pt
    SET category = _filter.category, user_filter_id = new_filter.id
    FROM temp_transactions tt
    WHERE pt.id = tt.id AND global_filter_id IS NULL;
  -- Override any existing global filter but not existing user
  ELSIF global_override THEN
    UPDATE plaid_transactions pt
    SET category = _filter.category,
      user_filter_id = new_filter.id,
      global_filter_id = NULL
    FROM temp_transactions tt
    WHERE pt.id = tt.id AND user_filter_id IS NULL;
  -- Only update transactions that don't have a filter
  ELSE
    UPDATE plaid_transactions pt
    SET category = _filter.category, user_filter_id = new_filter.id
    FROM temp_transactions tt
    WHERE pt.id = tt.id
      AND user_filter_id IS NULL
      AND global_filter_id IS NULL;
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
      global_filter_id = global_filter.id,
      user_filter_id = NULL
    WHERE user_filter_id = filter_id;
  ELSE
    UPDATE plaid_transactions
    SET
      category = CASE
        WHEN amount < 0 THEN 'Money-In'::category
        ELSE 'Money-Out'::category
      END,
      global_filter_id = NULL,
      user_filter_id = NULL
    WHERE user_filter_id = filter_id;
  END IF;

  DELETE FROM user_plaid_filters WHERE id = filter_id;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION delete_user_plaid_filter(
  filter_id int,
  global_filter_id int
) OWNER TO postgres;



-- Only allow the "category" column to be updated and update the transactions
-- that use this filter is connected to
CREATE OR REPLACE FUNCTION update_user_plaid_filter()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id <> OLD.id THEN
    RAISE EXCEPTION 'Updating "id" is not allowed';
  END IF;
  IF NEW.user_id <> OLD.user_id THEN
    RAISE EXCEPTION 'Updating "user_id" is not allowed';
  END IF;
  IF NEW.filter <> OLD.filter THEN
    RAISE EXCEPTION 'Updating "filter" is not allowed';
  END IF;

  UPDATE plaid_transactions
  SET category = NEW.category
  WHERE user_filter_id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION update_user_plaid_filter() OWNER TO postgres;

DROP TRIGGER IF EXISTS on_update_user_plaid_filter ON user_plaid_filters;
CREATE TRIGGER on_update_user_plaid_filter
  BEFORE UPDATE ON user_plaid_filters
    FOR EACH ROW
      EXECUTE FUNCTION update_user_plaid_filter();
