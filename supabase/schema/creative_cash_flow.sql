CREATE TABLE creative_cash_flow (
  id uuid PRIMARY KEY NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_creative_cash_flow_user_id ON creative_cash_flow(user_id);

ALTER TABLE creative_cash_flow OWNER TO postgres;
ALTER TABLE creative_cash_flow ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own creative cash flow data or if is admin" ON creative_cash_flow
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR (SELECT is_admin()));

CREATE POLICY "Can insert new creative cash flow data" ON creative_cash_flow
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Can update own creative cash flow data" ON creative_cash_flow
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Can delete own creative cash flow data" ON creative_cash_flow
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP TRIGGER IF EXISTS on_update_creative_cash_flow ON creative_cash_flow;
CREATE TRIGGER on_update_creative_cash_flow
  BEFORE UPDATE ON creative_cash_flow
    FOR EACH ROW
      EXECUTE FUNCTION verify_update_creative_cash_flow();



/**
 * creative_cash_flow functions
 */

CREATE OR REPLACE FUNCTION owns_creative_cash_flow()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM creative_cash_flow AS ccf
    WHERE ccf.id = id AND auth.uid() = ccf.user_id
  );
END;
$$ language plpgsql SECURITY DEFINER;

ALTER FUNCTION owns_creative_cash_flow() OWNER TO postgres;



-- Only allow the "name" column to be updated
CREATE OR REPLACE FUNCTION verify_update_creative_cash_flow()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id <> OLD.id THEN
    RAISE EXCEPTION 'Updating "id" is not allowed';
  END IF;
  IF NEW.user_id <> OLD.user_id THEN
    RAISE EXCEPTION 'Updating "user_id" is not allowed';
  END IF;
  IF NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'Updating "created_at" is not allowed';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION verify_update_creative_cash_flow() OWNER TO postgres;



CREATE OR REPLACE function create_creative_cash_flow (
  _user_id uuid,
  name text,
  inputs creative_cash_flow_inputs,
  results creative_cash_flow_results
) RETURNS TABLE (id uuid, created_at timestamp with time zone) AS $$
DECLARE
  new_id uuid;
  new_created_at timestamp with time zone;
BEGIN
  -- Generate a new UUID using the uuid-ossp extension
  SELECT uuid_generate_v4() INTO new_id;

  -- Get the current time in UTC
  new_created_at := NOW() AT TIME ZONE 'UTC';

  INSERT INTO creative_cash_flow (id, user_id, name, created_at)
  VALUES (new_id, _user_id, name, new_created_at);

  INSERT INTO creative_cash_flow_inputs (id, start_date, end_date, all_other_income, payroll_and_distributions, lifestyle_expenses_tax_rate, tax_account_rate, optimal_savings_strategy)
  VALUES (new_id, inputs.start_date, inputs.end_date, inputs.all_other_income, inputs.payroll_and_distributions, inputs.lifestyle_expenses_tax_rate, inputs.tax_account_rate, inputs.optimal_savings_strategy);

  INSERT INTO creative_cash_flow_results (id, collections, lifestyle_expenses, lifestyle_expenses_tax, business_profit_before_tax, business_overhead, tax_account, waa, actual_waa, total_waa, daily_trend, weekly_trend, yearly_trend, year_to_date)
  VALUES (new_id, results.collections, results.lifestyle_expenses, results.lifestyle_expenses_tax, results.business_profit_before_tax, results.business_overhead, results.tax_account, results.waa, results.actual_waa, results.total_waa, results.daily_trend, results.weekly_trend, results.yearly_trend, results.year_to_date);

  RETURN QUERY SELECT new_id, new_created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER FUNCTION create_creative_cash_flow(
  _user_id uuid,
  name text,
  inputs creative_cash_flow_inputs,
  results creative_cash_flow_results
) OWNER TO postgres;



CREATE OR REPLACE FUNCTION get_creative_cash_flow_records(_user_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  created_at timestamp with time zone,
  inputs json,
  results json
) AS $$
BEGIN
  RETURN QUERY
    SELECT
      ccf.id,
      ccf.name,
      ccf.created_at,
      json_build_object(
        'start_date', ccfi.start_date,
        'end_date', ccfi.end_date,
        'all_other_income', ccfi.all_other_income,
        'payroll_and_distributions', ccfi.payroll_and_distributions,
        'lifestyle_expenses_tax_rate', ccfi.lifestyle_expenses_tax_rate,
        'tax_account_rate', ccfi.tax_account_rate,
        'optimal_savings_strategy', ccfi.optimal_savings_strategy
      ),
      json_build_object(
        'collections', ccfr.collections,
        'lifestyle_expenses', ccfr.lifestyle_expenses,
        'lifestyle_expenses_tax', ccfr.lifestyle_expenses_tax,
        'business_profit_before_tax', ccfr.business_profit_before_tax,
        'business_overhead', ccfr.business_overhead,
        'tax_account', ccfr.tax_account,
        'waa', ccfr.waa,
        'actual_waa', ccfr.actual_waa,
        'total_waa', ccfr.total_waa,
        'daily_trend', ccfr.daily_trend,
        'weekly_trend', ccfr.weekly_trend,
        'yearly_trend', ccfr.yearly_trend,
        'year_to_date', ccfr.year_to_date
      )
    FROM creative_cash_flow ccf
    JOIN creative_cash_flow_inputs ccfi ON ccf.id = ccfi.id
    JOIN creative_cash_flow_results ccfr ON ccf.id = ccfr.id
    WHERE ccf.user_id = _user_id
    ORDER BY ccf.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER FUNCTION get_creative_cash_flow_records(_user_id uuid) OWNER TO postgres;



CREATE OR REPLACE FUNCTION get_creative_cash_flow_record(record_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  created_at timestamp with time zone,
  inputs json,
  results json
) AS $$
BEGIN
  RETURN QUERY
    SELECT
      ccf.id,
      ccf.name,
      ccf.created_at,
      json_build_object(
        'start_date', ccfi.start_date,
        'end_date', ccfi.end_date,
        'all_other_income', ccfi.all_other_income,
        'payroll_and_distributions', ccfi.payroll_and_distributions,
        'lifestyle_expenses_tax_rate', ccfi.lifestyle_expenses_tax_rate,
        'tax_account_rate', ccfi.tax_account_rate,
        'optimal_savings_strategy', ccfi.optimal_savings_strategy
      ),
      json_build_object(
        'collections', ccfr.collections,
        'lifestyle_expenses', ccfr.lifestyle_expenses,
        'lifestyle_expenses_tax', ccfr.lifestyle_expenses_tax,
        'business_profit_before_tax', ccfr.business_profit_before_tax,
        'business_overhead', ccfr.business_overhead,
        'tax_account', ccfr.tax_account,
        'waa', ccfr.waa,
        'actual_waa', ccfr.actual_waa,
        'total_waa', ccfr.total_waa,
        'daily_trend', ccfr.daily_trend,
        'weekly_trend', ccfr.weekly_trend,
        'yearly_trend', ccfr.yearly_trend,
        'year_to_date', ccfr.year_to_date
      )
    FROM creative_cash_flow ccf
    JOIN creative_cash_flow_inputs ccfi ON ccf.id = ccfi.id
    JOIN creative_cash_flow_results ccfr ON ccf.id = ccfr.id
    WHERE ccf.id = record_id;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION get_creative_cash_flow_record(record_id uuid) OWNER TO postgres;



CREATE TYPE ccf_plaid_transaction AS (
  id text,
  item_id text,
  name text,
  amount numeric,
  category text,
  date  timestamp with time zone
);

CREATE OR REPLACE FUNCTION get_ccf_transactions_by_user_id(user_id uuid)
RETURNS TABLE (
  personal ccf_plaid_transaction[],
  business ccf_plaid_transaction[]
) AS $$
DECLARE
  personal ccf_plaid_transaction[];
  business ccf_plaid_transaction[];
BEGIN
  SELECT COALESCE(
    array_agg(
      ROW(
        pt.id,
        pt.item_id,
        pt.name,
        pt.amount,
        pt.category,
        pt.date
      )::ccf_plaid_transaction
    ),
    ARRAY[]::ccf_plaid_transaction[]
  ) INTO personal
  FROM plaid_transactions pt
    INNER JOIN plaid_accounts pa ON pt.account_id = pa.account_id
    INNER JOIN plaid p ON p.item_id = pa.item_id
    INNER JOIN users u ON u.id = p.user_id
  WHERE
    pa.type IN ('personal', 'waa') AND
    u.id = $1 AND
    pa.enabled = true;

  SELECT COALESCE(
    array_agg(
      ROW(
        pt.id,
        pt.item_id,
        pt.name,
        pt.amount,
        pt.category,
        pt.date
      )::ccf_plaid_transaction
    ),
    ARRAY[]::ccf_plaid_transaction[]
  ) INTO business
  FROM plaid_transactions pt
    INNER JOIN plaid_accounts pa ON pt.account_id = pa.account_id
    INNER JOIN plaid p ON p.item_id = pa.item_id
    INNER JOIN users u ON u.id = p.user_id
  WHERE
    pa.type = 'business' AND
    u.id = $1 AND
    pa.enabled = true;

  RETURN QUERY SELECT personal, business;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER FUNCTION get_ccf_transactions_by_user_id(user_id uuid) OWNER TO postgres;
