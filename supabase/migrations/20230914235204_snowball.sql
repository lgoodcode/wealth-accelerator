/**
 * debt_snowball table
 */

DROP TABLE IF EXISTS debt_snowball CASCADE;
CREATE TABLE debt_snowball (
  id uuid PRIMARY KEY NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  debts jsonb[] NOT NULL
);

ALTER TABLE debt_snowball OWNER TO postgres;
ALTER TABLE debt_snowball ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own debt snowball data or if is admin" ON public.debt_snowball
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR (SELECT is_admin(auth.uid())));

CREATE POLICY "Can insert new debt snowball data" ON public.debt_snowball
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Can update own debt snowball data" ON public.debt_snowball
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Can delete own debt snowball data" ON public.debt_snowball
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);





/**
 * debt_snowball_inputs table
 */

DROP TABLE IF EXISTS debt_snowball_inputs CASCADE;
CREATE TABLE debt_snowball_inputs (
  id uuid PRIMARY KEY NOT NULL REFERENCES debt_snowball(id) ON DELETE CASCADE,
  additional_payment numeric(12,2) NOT NULL,
  monthly_payment numeric(12,2) NOT NULL,
  opporunity_rate numeric(5,2) NOT NULL,
  strategy text NOT NULL,
  lump_amounts numeric(12,2)[] NOT NULL,
  pay_back_loadn boolean NOT NULL,
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
    WHERE ds.id = debt_snowball_inputs.id AND auth.uid() = ds.user_id
  );
END;
$$ language plpgsql security definer;

ALTER FUNCTION owns_debt_snowball_inputs_record() OWNER TO postgres;

CREATE POLICY "Can view own debt snowball input data or if admin" ON public.debt_snowball_inputs
  FOR SELECT
  TO authenticated
  USING ((SELECT owns_debt_snowball_inputs_record()) OR (SELECT is_admin(auth.uid())));

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

DROP TYPE IF EXISTS current_calculation_results CASCADE;
CREATE TYPE current_calculation_results AS (
  debt_payoffs jsonb[],
  balance_tracking numeric(12,2)[][],
  interest_tracking numeric(12,2)[][],
  payoff_months integer,
  total_interest numeric(12,2),
  total_amount numeric(12,2)
);
ALTER TYPE current_calculation_results OWNER TO postgres;

DROP TYPE IF EXISTS loan_payback_type CASCADE;
CREATE TYPE loan_payback_type AS (
  total numeric(12,2),
  interest numeric(12,2),
  months integer,
  tracking numeric(12,2)[][]
);
ALTER TYPE loan_payback_type OWNER TO postgres;

DROP TYPE IF EXISTS strategy_calculation_results CASCADE;
CREATE TYPE strategy_calculation_results AS (
  debt_payoffs jsonb[],
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
    WHERE ds.id = debt_snowball_results.id AND auth.uid() = ds.user_id
  );
END;
$$ language plpgsql security definer;

ALTER FUNCTION owns_debt_snowball_results_record() OWNER TO postgres;

CREATE POLICY "Can view own debt snowball result data or if admin" ON public.debt_snowball_results
  FOR SELECT
  TO authenticated
  USING ((SELECT owns_debt_snowball_results_record()) OR (SELECT is_admin(auth.uid())));

CREATE POLICY "Can insert new debt snowball result data" ON public.debt_snowball_results
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT owns_debt_snowball_results_record()));

CREATE POLICY "Can delete own debt snowball result data" ON public.debt_snowball_results
  FOR DELETE
  TO authenticated
  USING ((SELECT owns_debt_snowball_inputs_record()));




