
DROP TABLE IF EXISTS creative_cash_flow_inputs CASCADE;
CREATE TABLE creative_cash_flow_inputs (
  id uuid PRIMARY KEY NOT NULL REFERENCES creative_cash_flow(id) ON DELETE CASCADE,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  all_other_income numeric(12,2) NOT NULL,
  payroll_and_distributions numeric(12,2) NOT NULL,
  lifestyle_expenses_tax_rate numeric(5,2) NOT NULL,
  tax_account_rate numeric(5,2) NOT NULL,
  optimal_savings_strategy numeric(12,2) NOT NULL
);

ALTER TABLE creative_cash_flow_inputs OWNER TO postgres;
ALTER TABLE creative_cash_flow_inputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own creative cash flow input data or if admin" ON creative_cash_flow_inputs
  FOR SELECT
  TO authenticated
  USING ((SELECT owns_creative_cash_flow()) OR (SELECT is_admin()));

CREATE POLICY "Can insert new creative cash flow input data" ON creative_cash_flow_inputs
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT owns_creative_cash_flow()));

CREATE POLICY "Can delete own creative cash flow input data" ON creative_cash_flow_inputs
  FOR DELETE
  TO authenticated
  USING ((SELECT owns_creative_cash_flow()));
