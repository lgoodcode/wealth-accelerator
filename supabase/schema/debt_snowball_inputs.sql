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

