ALTER TABLE creative_cash_flow_inputs
ALTER COLUMN all_other_income TYPE numeric(12,2),
ALTER COLUMN payroll_and_distributions TYPE numeric(12,2),
ALTER COLUMN optimal_savings_strategy TYPE numeric(12,2),
ALTER COLUMN lifestyle_expenses_tax_rate TYPE numeric(5,2),
ALTER COLUMN tax_account_rate TYPE numeric(5,2);

ALTER TABLE creative_cash_flow_results
ALTER COLUMN collections TYPE numeric(12,2),
ALTER COLUMN lifestyle_expenses TYPE numeric(12,2),
ALTER COLUMN lifestyle_expenses_tax TYPE numeric(12,2),
ALTER COLUMN business_profit_before_tax TYPE numeric(12,2),
ALTER COLUMN business_overhead TYPE numeric(12,2),
ALTER COLUMN tax_account TYPE numeric(12,2),
ALTER COLUMN waa TYPE numeric(12,2),
ALTER COLUMN total_waa TYPE numeric(12,2),
ALTER COLUMN weekly_trend TYPE numeric(12,2)[],
ALTER COLUMN monthly_trend TYPE numeric(12,2)[],
ALTER COLUMN yearly_trend TYPE numeric(12,2)[],
ALTER COLUMN year_to_date TYPE numeric(12,2);

drop function create_creative_cash_flow;

CREATE OR REPLACE function create_creative_cash_flow (
  _user_id uuid,
  _start_date timestamp with time zone,
  _end_date timestamp with time zone,
  _all_other_income numeric(12,2),
  _payroll_and_distributions numeric(12,2),
  _lifestyle_expenses_tax_rate numeric(5,2),
  _tax_account_rate numeric(5,2),
  _optimal_savings_strategy numeric(12,2),
  _collections numeric(12,2),
  _lifestyle_expenses numeric(12,2),
  _lifestyle_expenses_tax numeric(12,2),
  _business_profit_before_tax numeric(12,2),
  _business_overhead numeric(12,2),
  _tax_account numeric(12,2),
  _waa numeric(12,2),
  _total_waa numeric(12,2),
  _weekly_trend numeric(12,2)[],
  _monthly_trend numeric(12,2)[],
  _yearly_trend numeric(12,2)[],
  _year_to_date numeric(12,2)
) RETURNS uuid as $$
DECLARE
  new_id uuid;
BEGIN
  -- Generate a new UUID using the uuid-ossp extension
  SELECT uuid_generate_v4() INTO new_id;

  INSERT INTO creative_cash_flow (id, user_id)
  VALUES (new_id, _user_id);

  INSERT INTO creative_cash_flow_inputs (id, user_id, start_date, end_date, all_other_income, payroll_and_distributions, lifestyle_expenses_tax_rate, tax_account_rate, optimal_savings_strategy)
  VALUES (new_id, _user_id, _start_date, _end_date, _all_other_income, _payroll_and_distributions, _lifestyle_expenses_tax_rate, _tax_account_rate, _optimal_savings_strategy);

  INSERT INTO creative_cash_flow_results (id, user_id, collections, lifestyle_expenses, lifestyle_expenses_tax, business_profit_before_tax, business_overhead, tax_account, waa, total_waa, weekly_trend, monthly_trend, yearly_trend, year_to_date)
  VALUES (new_id, _user_id, _collections, _lifestyle_expenses, _lifestyle_expenses_tax, _business_profit_before_tax, _business_overhead, _tax_account, _waa, _total_waa, _weekly_trend, _monthly_trend, _yearly_trend, _year_to_date);

  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY definer;


ALTER FUNCTION create_creative_cash_flow(
  _user_id uuid,
  _start_date timestamp with time zone,
  _end_date timestamp with time zone,
  _all_other_income numeric(12,2),
  _payroll_and_distributions numeric(12,2),
  _lifestyle_expenses_tax_rate numeric(5,2),
  _tax_account_rate numeric(5,2),
  _optimal_savings_strategy numeric(12,2),
  _collections numeric(12,2),
  _lifestyle_expenses numeric(12,2),
  _lifestyle_expenses_tax numeric(12,2),
  _business_profit_before_tax numeric(12,2),
  _business_overhead numeric(12,2),
  _tax_account numeric(12,2),
  _waa numeric(12,2),
  _total_waa numeric(12,2),
  _weekly_trend numeric(12,2)[],
  _monthly_trend numeric(12,2)[],
  _yearly_trend numeric(12,2)[],
  _year_to_date numeric(12,2)
) OWNER TO postgres;
