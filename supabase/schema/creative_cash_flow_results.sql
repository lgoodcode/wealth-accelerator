
DROP TABLE IF EXISTS creative_cash_flow_results CASCADE;
CREATE TABLE creative_cash_flow_results (
  id uuid PRIMARY KEY NOT NULL REFERENCES creative_cash_flow(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  collections numeric(12,2) NOT NULL,
  lifestyle_expenses numeric(12,2) NOT NULL,
  lifestyle_expenses_tax numeric(12,2) NOT NULL,
  business_profit_before_tax numeric(12,2) NOT NULL,
  business_overhead numeric(12,2) NOT NULL,
  tax_account numeric(12,2) NOT NULL,
  waa numeric(12,2) NOT NULL,
  total_waa numeric(12,2) NOT NULL,
  daily_trend numeric(12,2)[] NOT NULL,
  weekly_trend numeric(12,2)[] NOT NULL,
  yearly_trend numeric(12,2)[] NOT NULL,
  year_to_date numeric(12,2) NOT NULL
);

ALTER TABLE creative_cash_flow_results OWNER TO postgres;
ALTER TABLE creative_cash_flow_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own CCF results data" ON public.creative_cash_flow_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Can insert new CCF results" ON public.creative_cash_flow_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Can delete own CCF results" ON public.creative_cash_flow_results
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
