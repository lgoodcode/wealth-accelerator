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

CREATE POLICY "Can view own debt snowball result data or if admin" ON debt_snowball_results
  FOR SELECT
  TO authenticated
  USING ((SELECT owns_debt_snowball_results_record()) OR (SELECT is_admin()));

CREATE POLICY "Can insert new debt snowball result data" ON debt_snowball_results
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT owns_debt_snowball_results_record()));

CREATE POLICY "Can delete own debt snowball result data" ON debt_snowball_results
  FOR DELETE
  TO authenticated
  USING ((SELECT owns_debt_snowball_inputs_record()));
