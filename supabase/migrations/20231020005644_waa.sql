alter table creative_cash_flow_results
add column actual_waa numeric(12,2),
alter column total_waa drop not null,
alter column total_waa set default null;

-- Retrieves the WAA account ID and item ID for a given user
CREATE OR REPLACE FUNCTION get_waa_account_id()
RETURNS TABLE (account_id TEXT, item_id TEXT) AS $$
DECLARE
  subquery_result INTEGER;
BEGIN
  -- Define the temporary table to store the results of the CTE
  CREATE TEMPORARY TABLE waa_accounts_temp AS (
    SELECT p.item_id, pa.account_id
    FROM plaid_accounts pa
    JOIN plaid p ON p.item_id = pa.item_id
    WHERE pa.type = 'waa' AND p.user_id = auth.uid()
    LIMIT 2 -- Limit to 2 because an exception will be raised if more than 1 is found
  );

  -- Check the number of rows returned by the subquery
  SELECT COUNT(*) INTO subquery_result FROM waa_accounts_temp;
  IF subquery_result = 0 THEN
    RAISE EXCEPTION 'No WAA account found';
  ELSIF subquery_result > 1 THEN
    RAISE EXCEPTION 'Multiple WAA accounts found';
  END IF;

  RETURN QUERY SELECT waa_accounts_temp.account_id, waa_accounts_temp.item_id FROM waa_accounts_temp LIMIT 1;

  DROP TABLE waa_accounts_temp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER FUNCTION get_waa_account_id() OWNER TO postgres;



CREATE OR REPLACE function create_creative_cash_flow (
  _user_id uuid,
  name text,
  inputs creative_cash_flow_inputs,
  results creative_cash_flow_results
) RETURNS TABLE (id uuid, created_at timestamp with time zone) AS $$
DECLARE
  id uuid;
  created_at timestamp with time zone;
BEGIN
  -- Generate a new UUID using the uuid-ossp extension
  SELECT uuid_generate_v4() INTO id;

  -- Get the current time in UTC
  created_at := NOW() AT TIME ZONE 'UTC';

  INSERT INTO creative_cash_flow (id, user_id, name, created_at)
  VALUES (id, _user_id, name, created_at);

  INSERT INTO creative_cash_flow_inputs (id, start_date, end_date, all_other_income, payroll_and_distributions, lifestyle_expenses_tax_rate, tax_account_rate, optimal_savings_strategy)
  VALUES (id, inputs.start_date, inputs.end_date, inputs.all_other_income, inputs.payroll_and_distributions, inputs.lifestyle_expenses_tax_rate, inputs.tax_account_rate, inputs.optimal_savings_strategy);

  INSERT INTO creative_cash_flow_results (id, collections, lifestyle_expenses, lifestyle_expenses_tax, business_profit_before_tax, business_overhead, tax_account, waa, actual_waa, total_waa, daily_trend, weekly_trend, yearly_trend, year_to_date)
  VALUES (id, results.collections, results.lifestyle_expenses, results.lifestyle_expenses_tax, results.business_profit_before_tax, results.business_overhead, results.tax_account, results.waa, results.actual_waa, results.total_waa, results.daily_trend, results.weekly_trend, results.yearly_trend, results.year_to_date);

  RETURN QUERY SELECT id, created_at;
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
