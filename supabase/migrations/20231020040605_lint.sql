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



drop function create_debt_snowball_record;

CREATE OR REPLACE FUNCTION create_debt_snowball_record (
  user_id uuid,
  name text,
  debts debt_snowball_debt[],
  inputs debt_snowball_inputs_data,
  results debt_snowball_results_data
) RETURNS TABLE (id uuid, created_at timestamp with time zone) AS $$
DECLARE
  new_id uuid;
  new_created_at timestamp with time zone;
BEGIN
  -- Generate a new UUID using the uuid-ossp extension
  SELECT uuid_generate_v4() INTO new_id;

  -- Get the current time in UTC
  new_created_at := NOW() AT TIME ZONE 'UTC';

  INSERT INTO debt_snowball (id, user_id, name, debts, created_at)
  VALUES (new_id, user_id, name, debts, new_created_at);

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

