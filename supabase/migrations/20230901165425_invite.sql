UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data,
  '{role}',
  '"USER"',
  true
);

UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data,
  '{role}',
  '"ADMIN"',
  true
)
WHERE id = '04b9a09f-dad2-4013-a28b-b2771c5bba03' OR id = '8d18fc14-2a51-44cc-8273-2e5ecb0718e7';


CREATE OR REPLACE FUNCTION get_auth_users()
RETURNS TABLE (
  id uuid,
  name text,
  email text,
  role user_role,
  confirmed_email boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
    SELECT
      u.id,
      u.raw_user_meta_data->>'name' AS name,
      u.email::text,
      COALESCE(UPPER(u.raw_user_meta_data->>'role')::user_role, 'USER'::user_role) AS role, -- I don't know why but it won't work without COALESCE
      (u.email_confirmed_at IS NOT NULL) AS confirmed_email,
      u.created_at,
      u.updated_at
    FROM
      auth.users u
    ORDER BY
      u.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION get_auth_users() OWNER TO postgres;





ALTER TABLE creative_cash_flow_results
RENAME COLUMN monthly_trend TO daily_trend;



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
  _daily_trend numeric(12,2)[],
  _weekly_trend numeric(12,2)[],
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
  VALUES (new_id, _user_id, _collections, _lifestyle_expenses, _lifestyle_expenses_tax, _business_profit_before_tax, _business_overhead, _tax_account, _waa, _total_waa, _weekly_trend, _daily_trend, _yearly_trend, _year_to_date);

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
  _daily_trend numeric(12,2)[],
  _weekly_trend numeric(12,2)[],
  _yearly_trend numeric(12,2)[],
  _year_to_date numeric(12,2)
) OWNER TO postgres;
