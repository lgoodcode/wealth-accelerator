DROP TYPE IF EXISTS debt_snowball_debt;
CREATE TYPE debt_snowball_debt AS (
  description text,
  amount numeric(12,2),
  payment numeric(12,2),
  interest numeric(5,2),
  months_remaining smallint
);
ALTER TYPE debt_snowball_debt OWNER TO postgres;

DROP TABLE IF EXISTS debt_snowball CASCADE;
CREATE TABLE debt_snowball (
  id uuid PRIMARY KEY NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  debts debt_snowball_debt[] NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_debt_snowball_user_id ON debt_snowball(user_id);

ALTER TABLE debt_snowball OWNER TO postgres;
ALTER TABLE debt_snowball ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own debt snowball data or if is admin" ON debt_snowball
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR (SELECT is_admin()));

CREATE POLICY "Can insert new debt snowball data" ON debt_snowball
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Can update own debt snowball data" ON debt_snowball
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Can delete own debt snowball data" ON debt_snowball
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Only allow the "name" column to be updated
CREATE OR REPLACE FUNCTION verify_update_debt_snowball()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id <> OLD.id THEN
    RAISE EXCEPTION 'Updating "id" is not allowed';
  END IF;
  IF NEW.user_id <> OLD.user_id THEN
    RAISE EXCEPTION 'Updating "user_id" is not allowed';
  END IF;
  IF NEW.debts <> OLD.debts THEN
    RAISE EXCEPTION 'Updating "debts" is not allowed';
  END IF;
  IF NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'Updating "created_at" is not allowed';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION verify_update_debt_snowball() OWNER TO postgres;

DROP TRIGGER IF EXISTS on_update_debt_snowball ON debt_snowball;
CREATE TRIGGER on_update_debt_snowball
  BEFORE UPDATE ON debt_snowball
    FOR EACH ROW
      EXECUTE FUNCTION verify_update_debt_snowball();



/**
 * debt_snowball function types
 */

DROP TYPE IF EXISTS debt_snowball_inputs_data;
CREATE TYPE debt_snowball_inputs_data AS (
  additional_payment numeric(12,2),
  monthly_payment numeric(12,2),
  opportunity_rate numeric(5,2),
  strategy text,
  lump_amounts numeric(12,2)[],
  pay_back_loan boolean,
  pay_interest boolean,
  loan_interest_rate numeric(5,2)
);
ALTER TYPE debt_snowball_inputs_data OWNER TO postgres;

DROP TYPE IF EXISTS debt_snowball_results_data;
CREATE TYPE debt_snowball_results_data AS (
  current current_calculation_results,
  strategy strategy_calculation_results
);
ALTER TYPE debt_snowball_results_data OWNER TO postgres;



/**
 * debt_snowball functions
 */

CREATE OR REPLACE FUNCTION create_debt_snowball_record (
  user_id uuid,
  name text,
  debts debt_snowball_debt[],
  inputs debt_snowball_inputs_data,
  results debt_snowball_results_data
) RETURNS TABLE (new_id uuid, new_created_at timestamp with time zone) AS $$
DECLARE
  new_id uuid;
  new_created_at timestamp with time zone;
BEGIN
  -- Generate a new UUID using the uuid-ossp extension
  SELECT uuid_generate_v4() INTO new_id;

  INSERT INTO debt_snowball (id, user_id, name, debts, created_at)
  VALUES (new_id, user_id, name, debts, NOW())
  RETURNING created_at INTO new_created_at;

  INSERT INTO debt_snowball_inputs (id, additional_payment, monthly_payment, opportunity_rate, strategy, lump_amounts, pay_back_loan, pay_interest, loan_interest_rate)
  VALUES (new_id, inputs.additional_payment, inputs.monthly_payment, inputs.opportunity_rate, inputs.strategy, inputs.lump_amounts, inputs.pay_back_loan, inputs.pay_interest, inputs.loan_interest_rate);

  INSERT INTO debt_snowball_results (id, current, strategy)
  VALUES (new_id, results.current, results.strategy);

  RETURN QUERY SELECT new_id, new_created_at;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION create_debt_snowball_record(
  user_id uuid,
  name text,
  debts debt_snowball_debt[],
  inputs debt_snowball_inputs_data,
  results debt_snowball_results_data
) OWNER TO postgres;



-- When retrieving the data, on the client you will need to use the restoreLastArrayToLastZero
-- util function to restore the array to its original state for the following properties:
--     results.current.balance_tracking
--     results.strategy.balance_tracking
--     results.strategy.loan_payback.tracking
CREATE OR REPLACE FUNCTION get_debt_snowball_records(_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  name text,
  created_at timestamp with time zone,
  debts debt_snowball_debt[],
  inputs json, -- Using JSON because using a custom type this wasn't working
  results json
) AS $$
BEGIN
  RETURN QUERY
    SELECT
      ds.id,
      ds.user_id,
      ds.name,
      ds.created_at,
      ds.debts,
      json_build_object(
        'additional_payment', dsi.additional_payment,
        'monthly_payment', dsi.monthly_payment,
        'opportunity_rate', dsi.opportunity_rate,
        'strategy', dsi.strategy,
        'lump_amounts', dsi.lump_amounts,
        'pay_back_loan', dsi.pay_back_loan,
        'pay_interest', dsi.pay_interest,
        'loan_interest_rate', dsi.loan_interest_rate
      ) AS debt_snowball_inputs_data,
      json_build_object(
        'current', dsr.current,
        'strategy', dsr.strategy
      ) AS debt_snowball_results_data
  FROM debt_snowball ds
  JOIN debt_snowball_inputs dsi ON ds.id = dsi.id
  JOIN debt_snowball_results dsr ON ds.id = dsr.id
  WHERE ds.user_id = _user_id;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION get_debt_snowball_records(_user_id uuid) OWNER TO postgres;



-- When retrieving the data, on the client you will need to use the restoreLastArrayToLastZero
-- util function to restore the array to its original state for the following properties:
--     results.current.balance_tracking
--     results.strategy.balance_tracking
--     results.strategy.loan_payback.tracking
CREATE OR REPLACE FUNCTION get_debt_snowball_record(record_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  name text,
  created_at timestamp with time zone,
  debts debt_snowball_debt[],
  inputs json, -- Using JSON because using a custom type this wasn't working
  results json
) AS $$
BEGIN
  RETURN QUERY
    SELECT
      ds.id,
      ds.user_id,
      ds.name,
      ds.created_at,
      ds.debts,
      json_build_object(
        'additional_payment', dsi.additional_payment,
        'monthly_payment', dsi.monthly_payment,
        'opportunity_rate', dsi.opportunity_rate,
        'strategy', dsi.strategy,
        'lump_amounts', dsi.lump_amounts,
        'pay_back_loan', dsi.pay_back_loan,
        'pay_interest', dsi.pay_interest,
        'loan_interest_rate', dsi.loan_interest_rate
      ) AS debt_snowball_inputs_data,
      json_build_object(
        'current', dsr.current,
        'strategy', dsr.strategy
      ) AS debt_snowball_results_data
  FROM debt_snowball ds
  JOIN debt_snowball_inputs dsi ON ds.id = dsi.id
  JOIN debt_snowball_results dsr ON ds.id = dsr.id
  WHERE ds.id = record_id;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION get_debt_snowball_record(record_id uuid) OWNER TO postgres;



CREATE OR REPLACE FUNCTION delete_snowball_record(record_id UUID)
RETURNS VOID AS $$
BEGIN
  DELETE FROM debt_snowball WHERE id = record_id;
  DELETE FROM debt_snowball_results WHERE id = record_id;
  DELETE FROM debt_snowball_inputs WHERE id = record_id;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION delete_snowball_record(record_id uuid) OWNER TO postgres;
