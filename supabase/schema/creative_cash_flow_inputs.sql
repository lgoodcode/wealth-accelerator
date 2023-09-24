
DROP TABLE IF EXISTS creative_cash_flow_inputs CASCADE;
CREATE TABLE creative_cash_flow_inputs (
  id uuid PRIMARY KEY NOT NULL REFERENCES creative_cash_flow(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
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

CREATE POLICY "Can view own CCF inputs data" ON public.creative_cash_flow_inputs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Can insert new CCF inputs" ON public.creative_cash_flow_inputs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Can delete own CCF inputs" ON public.creative_cash_flow_inputs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
