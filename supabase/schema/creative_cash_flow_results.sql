CREATE TABLE creative_cash_flow_results (
  id uuid PRIMARY KEY NOT NULL REFERENCES creative_cash_flow(id) ON DELETE CASCADE,
  collections numeric(12,2) NOT NULL,
  lifestyle_expenses numeric(12,2) NOT NULL,
  lifestyle_expenses_tax numeric(12,2) NOT NULL,
  business_profit_before_tax numeric(12,2) NOT NULL,
  business_overhead numeric(12,2) NOT NULL,
  tax_account numeric(12,2) NOT NULL,
  waa numeric(12,2) NOT NULL,
  actual_waa numeric(12,2), -- WAA account balance - if null, then there was no balance retrieved
  total_waa numeric(12,2) DEFAULT NULL, -- Keeping this column for backwards compatibility, for now
  daily_trend numeric(12,2)[] NOT NULL,
  weekly_trend numeric(12,2)[] NOT NULL,
  yearly_trend numeric(12,2)[] NOT NULL,
  year_to_date numeric(12,2) NOT NULL
);

ALTER TABLE creative_cash_flow_results OWNER TO postgres;
ALTER TABLE creative_cash_flow_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own creative cash flow result data or if admin" ON creative_cash_flow_results
  FOR SELECT
  TO authenticated
  USING ((SELECT owns_creative_cash_flow()) OR (SELECT is_admin()));

CREATE POLICY "Can insert new creative cash flow result data" ON creative_cash_flow_results
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT owns_creative_cash_flow()));

CREATE POLICY "Can delete own creative cash flow result data" ON creative_cash_flow_results
  FOR DELETE
  TO authenticated
  USING ((SELECT owns_creative_cash_flow()));
