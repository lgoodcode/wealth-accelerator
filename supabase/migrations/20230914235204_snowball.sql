CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE auth.uid() = id AND role = 'ADMIN'::user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION is_admin() OWNER TO postgres;

CREATE OR REPLACE FUNCTION get_creative_cash_flow_records(arg_user_id uuid)
RETURNS TABLE (id uuid, inputs jsonb, results jsonb) AS $$
BEGIN
    RETURN QUERY
        SELECT
            cc.id,
            to_jsonb(ccfi.*) AS ccfi,
            to_jsonb(ccfr.*) AS ccfr
        FROM creative_cash_flow cc
        JOIN creative_cash_flow_inputs ccfi ON cc.id = ccfi.id
        JOIN creative_cash_flow_results ccfr ON cc.id = ccfr.id
        WHERE ccfi.user_id = arg_user_id
        ORDER BY ccfi.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION get_creative_cash_flow_records(arg_user_id uuid) OWNER TO postgres;



/**
 * debt_snowball table
 */

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

ALTER TABLE debt_snowball OWNER TO postgres;
ALTER TABLE debt_snowball ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own debt snowball data or if is admin" ON public.debt_snowball
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR (SELECT is_admin()));

CREATE POLICY "Can insert new debt snowball data" ON public.debt_snowball
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Can update own debt snowball data" ON public.debt_snowball
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Can delete own debt snowball data" ON public.debt_snowball
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE OR REPLACE FUNCTION handle_update_debt_snowball()
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

DROP TRIGGER IF EXISTS on_update_debt_snowball ON debt_snowball;
CREATE TRIGGER on_update_debt_snowball
  BEFORE UPDATE ON debt_snowball
    FOR EACH ROW
      EXECUTE PROCEDURE handle_update_debt_snowball();





/**
 * debt_snowball_inputs table
 */

DROP TABLE IF EXISTS debt_snowball_inputs CASCADE;
CREATE TABLE debt_snowball_inputs (
  id uuid PRIMARY KEY NOT NULL REFERENCES debt_snowball(id) ON DELETE CASCADE,
  additional_payment numeric(12,2) NOT NULL,
  monthly_payment numeric(12,2) NOT NULL,
  opportunity_rate numeric(5,2) NOT NULL,
  strategy text NOT NULL,
  lump_amounts numeric(12,2)[] NOT NULL,
  pay_back_loan boolean NOT NULL,
  pay_interest boolean NOT NULL,
  loan_interest_rate numeric(5,2) NOT NULL
);

ALTER TABLE debt_snowball_inputs OWNER TO postgres;
ALTER TABLE debt_snowball_inputs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION owns_debt_snowball_inputs_record()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM debt_snowball AS ds
    WHERE ds.id = id AND auth.uid() = ds.user_id
  );
END;
$$ language plpgsql;

ALTER FUNCTION owns_debt_snowball_inputs_record() OWNER TO postgres;

CREATE POLICY "Can view own debt snowball input data or if admin" ON public.debt_snowball_inputs
  FOR SELECT
  TO authenticated
  USING ((SELECT owns_debt_snowball_inputs_record()) OR (SELECT is_admin()));

CREATE POLICY "Can insert new debt snowball input data" ON public.debt_snowball_inputs
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT owns_debt_snowball_inputs_record()));

CREATE POLICY "Can delete own debt snowball input data" ON public.debt_snowball_inputs
  FOR DELETE
  TO authenticated
  USING ((SELECT owns_debt_snowball_inputs_record()));





/**
 * debt_snowball_results types
 */

DROP TYPE IF EXISTS debt_snowball_debt_payoff_debt;
CREATE TYPE debt_snowball_debt_payoff_debt AS (
  description text
);
ALTER TYPE debt_snowball_debt_payoff_debt OWNER TO postgres;

DROP TYPE IF EXISTS debt_snowball_debt_payoff;
CREATE TYPE debt_snowball_debt_payoff AS (
  debt debt_snowball_debt_payoff_debt,
  payment_tracking numeric(12,2)[][]
);
ALTER TYPE debt_snowball_debt_payoff OWNER TO postgres;

DROP TYPE IF EXISTS current_calculation_results;
CREATE TYPE current_calculation_results AS (
  debt_payoffs debt_snowball_debt_payoff[],
  balance_tracking numeric(12,2)[][],
  interest_tracking numeric(12,2)[][],
  payoff_months integer,
  total_interest numeric(12,2),
  total_amount numeric(12,2)
);
ALTER TYPE current_calculation_results OWNER TO postgres;

DROP TYPE IF EXISTS loan_payback_type;
CREATE TYPE loan_payback_type AS (
  total numeric(12,2),
  interest numeric(12,2),
  months integer,
  tracking numeric(12,2)[][]
);
ALTER TYPE loan_payback_type OWNER TO postgres;

DROP TYPE IF EXISTS strategy_calculation_results;
CREATE TYPE strategy_calculation_results AS (
  debt_payoffs debt_snowball_debt_payoff[],
  balance_tracking numeric(12,2)[][],
  interest_tracking numeric(12,2)[][],
  payoff_months integer,
  total_interest numeric(12,2),
  total_amount numeric(12,2),
  snowball_tracking numeric(12,2)[][],
  loan_payback loan_payback_type
);
ALTER TYPE strategy_calculation_results OWNER TO postgres;



/**
 * debt_snowball_results table
 */

DROP TABLE IF EXISTS debt_snowball_results CASCADE;
CREATE TABLE debt_snowball_results (
  id uuid PRIMARY KEY NOT NULL REFERENCES debt_snowball(id) ON DELETE CASCADE,
  current current_calculation_results NOT NULL,
  strategy strategy_calculation_results NOT NULL
);

ALTER TABLE debt_snowball_results OWNER TO postgres;
ALTER TABLE debt_snowball_results ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION owns_debt_snowball_results_record()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM debt_snowball AS ds
    WHERE ds.id = id AND auth.uid() = ds.user_id
  );
END;
$$ language plpgsql;

ALTER FUNCTION owns_debt_snowball_results_record() OWNER TO postgres;

CREATE POLICY "Can view own debt snowball result data or if admin" ON public.debt_snowball_results
  FOR SELECT
  TO authenticated
  USING ((SELECT owns_debt_snowball_results_record()) OR (SELECT is_admin()));

CREATE POLICY "Can insert new debt snowball result data" ON public.debt_snowball_results
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT owns_debt_snowball_results_record()));

CREATE POLICY "Can delete own debt snowball result data" ON public.debt_snowball_results
  FOR DELETE
  TO authenticated
  USING ((SELECT owns_debt_snowball_inputs_record()));







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
CREATE OR REPLACE FUNCTION get_debt_snowball_data_records(_user_id uuid)
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

ALTER FUNCTION get_debt_snowball_data_records(_user_id uuid) OWNER TO postgres;




-- When retrieving the data, on the client you will need to use the restoreLastArrayToLastZero
-- util function to restore the array to its original state for the following properties:
--     results.current.balance_tracking
--     results.strategy.balance_tracking
--     results.strategy.loan_payback.tracking
CREATE OR REPLACE FUNCTION get_debt_snowball_data_record(record_id uuid)
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

ALTER FUNCTION get_debt_snowball_data_record(record_id uuid) OWNER TO postgres;

