/**
 * users table
 *
 * This table is used to store user data that is not provided by Supabase Auth.
 * It is linked to the auth.users table via the id column.
 */

DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS enum ('USER', 'ADMIN');
ALTER TYPE user_role OWNER TO postgres;

DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role user_role NOT NULL DEFAULT 'USER'::user_role,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.users OWNER TO postgres;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  PERFORM
  FROM public.users
  WHERE id = user_id AND role = 'ADMIN'::user_role;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION is_admin(UUID) OWNER TO postgres;

CREATE POLICY "Can view their own data and admins can view all user data" ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR is_admin(auth.uid()));

CREATE POLICY "Can update own user data or admins can update all users data" ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR is_admin(auth.uid()))
  -- WITH CHECK checks the data after modification, so we just check that the role is not changed if the user is not an admin
  WITH CHECK ((auth.uid() = id AND role = users.role) OR is_admin(auth.uid()));

CREATE POLICY "Admins can delete users" ON public.users
  FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Function that creates a user in our users table when a new user is created in auth.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    LOWER(NEW.email),
    INITCAP(NEW.raw_user_meta_data->>'name')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION handle_new_user() OWNER TO postgres;

-- Trigger that calls the function above
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
    FOR EACH ROW
      EXECUTE PROCEDURE handle_new_user();





/**
 * peronal_finance table
 */

-- Function that generates the rates array of 60 decimal(5,2) [] with a default value of 7
-- and divide the value by 100 when displaying/using it
CREATE OR REPLACE FUNCTION generate_rates()
RETURNS decimal(5,2) [] AS $$
BEGIN
  RETURN ARRAY(SELECT 7::decimal(5,2) FROM generate_series(1, 60));
END
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION generate_rates() OWNER TO postgres;

DROP TABLE IF EXISTS personal_finance CASCADE;
CREATE TABLE personal_finance (
  id int PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  -- Strategy start date
  start_date timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  -- Index fund rates
  rates decimal(5,2) [] NOT NULL DEFAULT generate_rates(), -- generates an array of 60 decimal(5,2) [] with a default value of 7
  -- Wealth accelerator
  stop_invest smallint NOT NULL DEFAULT 10,
  start_withdrawl smallint NOT NULL DEFAULT 20,
  money_needed_to_live int NOT NULL DEFAULT 100000,
  tax_bracket smallint NOT NULL DEFAULT 25,
  tax_bracket_future smallint NOT NULL DEFAULT 30,
  premium_deposit int NOT NULL DEFAULT 50000,
  ytd_collections int NOT NULL DEFAULT 0,
  default_tax_rate smallint NOT NULL DEFAULT 25
);

ALTER TABLE personal_finance OWNER TO postgres;
ALTER TABLE personal_finance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own personal_finance data" ON public.personal_finance
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Can update own personal_finance data" ON public.personal_finance
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function that creates a personal_finance row when a new user is created in public.users
CREATE OR REPLACE FUNCTION handle_init_personal_finance()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new row into the personal_finance table for the new user
  INSERT INTO public.personal_finance (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION handle_init_personal_finance() OWNER TO postgres;

-- Trigger the function above when a new user is created
DROP TRIGGER IF EXISTS on_user_created_init_personal_finance ON public.users;
CREATE TRIGGER on_user_created_init_personal_finance
  AFTER INSERT ON public.users
  FOR EACH ROW
    EXECUTE FUNCTION handle_init_personal_finance();





/**
 * debts table
 */

DROP TABLE IF EXISTS debts CASCADE;
CREATE TABLE debts (
  id int PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  amount decimal(10,2) NOT NULL,
  payment decimal(10,2) NOT NULL,
  interest decimal(5,2) NOT NULL,
  months_remaining smallint NOT NULL DEFAULT 0
);

ALTER TABLE debts OWNER TO postgres;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own debt data or admins can view all debt data" ON public.debts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_admin(auth.uid()));

CREATE POLICY "Can insert new debts" ON public.debts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Can update own debt data" ON public.debts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Can delete own debts" ON public.debts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);





/**
 * plaid table
 *
 * The main Plaid table containing the user's Plaid access tokens for each item.
 */

DROP TABLE IF EXISTS plaid CASCADE;
CREATE TABLE plaid (
  item_id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  access_token text UNIQUE NOT NULL,
  expiration timestamp with time zone NOT NULL,
  cursor text -- used to track last transactions synced
);

ALTER TABLE plaid OWNER TO postgres;
ALTER TABLE plaid ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own institution data" ON public.plaid
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Can insert new institutions" ON public.plaid
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Can update own institution data" ON public.plaid
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Can delete own institutions" ON public.plaid
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);




/**
 * plaid_accounts table
 *
 * This table contains the user's accounts for each institution.
 */

DROP TYPE IF EXISTS account_type CASCADE;
CREATE TYPE account_type AS enum ('personal', 'business');
ALTER TYPE account_type OWNER TO postgres;

DROP TABLE IF EXISTS plaid_accounts CASCADE;
CREATE TABLE plaid_accounts (
  account_id text PRIMARY KEY,
  item_id text NOT NULL REFERENCES plaid(item_id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'business'::account_type,
  enabled boolean NOT NULL DEFAULT true
);

ALTER TABLE plaid_accounts OWNER TO postgres;
ALTER TABLE plaid_accounts ENABLE ROW LEVEL SECURITY;

-- Because the user_id is not stored in the plaid_accounts table, we need to join the plaid table
CREATE OR REPLACE FUNCTION is_own_plaid_account()
RETURNS BOOL AS $$
BEGIN
  PERFORM
  FROM plaid as p
  WHERE p.item_id = item_id AND p.user_id = auth.uid();
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION is_own_plaid_account() OWNER TO postgres;

CREATE POLICY "Can view own plaid accounts data" ON public.plaid_accounts
  FOR SELECT
  TO authenticated
  USING (is_own_plaid_account());

CREATE POLICY "Can insert own plaid accounts" ON public.plaid_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (is_own_plaid_account());

CREATE POLICY "Can update own plaid accounts data" ON public.plaid_accounts
  FOR UPDATE
  TO authenticated
  USING (is_own_plaid_account());

CREATE POLICY "Can delete own plaid accounts" ON public.plaid_accounts
  FOR DELETE
  TO authenticated
  USING (is_own_plaid_account());





/**
 * plaid_transactions table
 *
 * This table contains the user's transactions for each account.
 */

DROP TYPE IF EXISTS category CASCADE;
CREATE TYPE category AS ENUM ('Transfer', 'Money-In', 'Money-Out');
ALTER TYPE category OWNER TO postgres;

DROP TABLE IF EXISTS plaid_transactions CASCADE;
CREATE TABLE plaid_transactions (
  id text PRIMARY KEY, -- the transaction id from Plaid
  item_id text NOT NULL REFERENCES plaid(item_id) ON DELETE CASCADE,
  account_id text NOT NULL REFERENCES plaid_accounts(account_id) ON DELETE CASCADE,
  name text NOT NULL,
  amount decimal(10,2) NOT NULL,
  category category NOT NULL,
  date timestamp with time zone NOT NULL
);

ALTER TABLE plaid_transactions OWNER TO postgres;
ALTER TABLE plaid_transactions ENABLE ROW LEVEL SECURITY;

-- Index the name column, which is text, to optimize for case-insensitive LIKE queries
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX trgm_idx_plaid_transactions_name ON plaid_transactions USING gin (name gin_trgm_ops);

-- Because the user_id is not stored in the plaid_accounts table, we need to join the plaid table
CREATE OR REPLACE FUNCTION is_own_plaid_transaction()
RETURNS BOOL AS $$
BEGIN
  PERFORM
  FROM plaid as p
  WHERE p.item_id = item_id AND p.user_id = auth.uid();
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION is_own_plaid_transaction() OWNER TO postgres;

CREATE POLICY "Can view own plaid transactions data" ON public.plaid_transactions
  FOR SELECT
  TO authenticated
  USING (is_own_plaid_transaction());

CREATE POLICY "Can insert own plaid transactions" ON public.plaid_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (is_own_plaid_transaction());

CREATE POLICY "Can update own plaid transactions data" ON public.plaid_transactions
  FOR UPDATE
  TO authenticated
  USING (is_own_plaid_transaction());

CREATE POLICY "Can delete own plaid transactions" ON public.plaid_transactions
  FOR DELETE
  TO authenticated
  USING (is_own_plaid_transaction());

-- Function that formats a transaction that is being inserted
CREATE OR REPLACE FUNCTION format_transaction()
RETURNS TRIGGER AS $$
BEGIN
  NEW.date = NEW.date + INTERVAL '7 hours'; -- Add 7 hours to get it to proper UTC time format
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION format_transaction() OWNER TO postgres;

-- Trigger to format the transactions date whenever a new transaction is inserted
DROP TRIGGER IF EXISTS on_insert_plaid_transactions ON public.plaid_transactions;
CREATE TRIGGER on_insert_plaid_transactions
  BEFORE INSERT ON public.plaid_transactions
    FOR EACH ROW
      EXECUTE FUNCTION format_transaction();



/**
 * plaid_filters table
 *
 * This table contains the user's filters that are used to categorize transactions.
 */

DROP TABLE IF EXISTS plaid_filters CASCADE;
CREATE TABLE plaid_filters (
  id int PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  filter text UNIQUE NOT NULL,
  category category NOT NULL
);

ALTER TABLE plaid_filters OWNER TO postgres;
ALTER TABLE plaid_filters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view plaid filters data" ON public.plaid_filters
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert plaid filters" ON public.plaid_filters
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update plaid filters data" ON public.plaid_filters
  FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete plaid filters" ON public.plaid_filters
  FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Function that updates the transactions table with the category from the new or updated filter
CREATE OR REPLACE FUNCTION update_transaction_categories()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE plaid_transactions
  SET category = NEW.category
  WHERE name ILIKE '%' || NEW.filter || '%';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION update_transaction_categories() OWNER TO postgres;

-- Trigger to update the transactions table when a new filter is created or updated
DROP TRIGGER IF EXISTS on_update_or_insert_filter_update_transaction_categories ON public.plaid_filters;
CREATE TRIGGER on_update_or_insert_filter_update_transaction_categories
  AFTER INSERT OR UPDATE ON public.plaid_filters
    FOR EACH ROW
      EXECUTE FUNCTION update_transaction_categories();

-- Function that re-categorizes all transactions that match the deleted filter
CREATE OR REPLACE FUNCTION recategorize_transactions()
RETURNS TRIGGER AS $$
BEGIN
  -- Update rows in plaid_transactions table that match the deleted filter.
  UPDATE plaid_transactions
  SET category = CASE
    WHEN amount < 0 THEN 'Money-In'::category
    ELSE 'Money-Out'::category
  END
  WHERE name ILIKE '%' || OLD.filter || '%';

  RETURN NULL; -- The function does not modify the row being deleted, so return NULL.
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION recategorize_transactions() OWNER TO postgres;

-- Trigger to recategorize the transactions from the deleted filter when it is deleted
DROP TRIGGER IF EXISTS on_delete_filter_recategorize_transactions ON public.plaid_filters;
CREATE TRIGGER on_delete_filter_recategorize_transactions
  AFTER DELETE ON plaid_filters
    FOR EACH ROW
      EXECUTE FUNCTION recategorize_transactions();






/**
 * creative_cash_flow table
 */

DROP TABLE IF EXISTS creative_cash_flow CASCADE;
CREATE TABLE creative_cash_flow (
  id uuid PRIMARY KEY NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL
);

ALTER TABLE creative_cash_flow OWNER TO postgres;
ALTER TABLE creative_cash_flow ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own CCF or if is admin" ON public.creative_cash_flow
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_admin(auth.uid()));

CREATE POLICY "Can insert new CCF data" ON public.creative_cash_flow
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Can update own CCF data" ON public.creative_cash_flow
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Can delete own CCF data" ON public.creative_cash_flow
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

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

  INSERT INTO creative_cash_flow_results (id, user_id, collections, lifestyle_expenses, lifestyle_expenses_tax, business_profit_before_tax, business_overhead, tax_account, waa, total_waa, daily_trend, weekly_trend, yearly_trend, year_to_date)
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




/**
 * creative_cash_flow_inputs table
 */

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





/**
 * creative_cash_flow_results table
 */

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





/**
 * creative_cash_flow_notifiers table
 */

DROP TABLE IF EXISTS creative_cash_flow_notifiers CASCADE;
CREATE TABLE creative_cash_flow_notifiers (
  id int PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  enabled boolean NOT NULL DEFAULT true
);

ALTER TABLE creative_cash_flow_notifiers OWNER TO postgres;
ALTER TABLE creative_cash_flow_notifiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view plaid creative_cash_flow_notifiers data" ON public.creative_cash_flow_notifiers
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admin can insert plaid creative_cash_flow_notifiers" ON public.creative_cash_flow_notifiers
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admin can update plaid creative_cash_flow_notifiers data" ON public.creative_cash_flow_notifiers
  FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admin can delete plaid creative_cash_flow_notifiers" ON public.creative_cash_flow_notifiers
  FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));




-- /**
--  * insurance_companies table
--  */

-- DROP TABLE IF EXISTS insurance_companies CASCADE;
-- CREATE TABLE insurance_companies (
--   id int PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
--   name text UNIQUE NOT NULL
-- );

-- ALTER TABLE insurance_companies OWNER TO postgres;
-- ALTER TABLE insurance_companies ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Admins can view data." ON public.insurance_companies
--   FOR SELECT
--   TO authenticated
--   USING (is_admin(auth.uid()));

-- CREATE POLICY "Admins can insert data." ON public.insurance_companies
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (is_admin(auth.uid()));

-- CREATE POLICY "Admins can update data." ON public.insurance_companies
--   FOR UPDATE
--   TO authenticated
--   USING (is_admin(auth.uid()));

-- CREATE POLICY "Admins can delete data." ON public.insurance_companies
--   FOR DELETE
--   TO authenticated
--   USING (is_admin(auth.uid()));





-- /**
--  * insurance_policies table
--  */

-- DROP TABLE IF EXISTS insurance_policies CASCADE;
-- CREATE TABLE insurance_policies (
--   id int PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
--   user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
--   company_id int REFERENCES insurance_companies(id) NOT NULL,
--   name text NOT NULL
-- );

-- ALTER TABLE insurance_policies OWNER TO postgres;
-- ALTER TABLE insurance_policies ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Admin can view insurance_policies data" ON public.insurance_policies
--   FOR SELECT
--   TO authenticated
--   USING (is_admin(auth.uid()));

-- CREATE POLICY "Admin can insert insurance_policies" ON public.insurance_policies
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (is_admin(auth.uid()));

-- CREATE POLICY "Admin can update insurance_policies data" ON public.insurance_policies
--   FOR UPDATE
--   TO authenticated
--   USING (is_admin(auth.uid()));

-- CREATE POLICY "Admin can delete insurance_policies" ON public.insurance_policies
--   FOR DELETE
--   TO authenticated
--   USING (is_admin(auth.uid()));





-- /**
--  * insurance_policy_rows table
--  */

-- DROP TABLE IF EXISTS insurance_policy_rows CASCADE;
-- CREATE TABLE insurance_policy_rows (
--   id int PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
--   policy_id int REFERENCES insurance_policies(id) ON DELETE CASCADE NOT NULL,
--   year smallint NOT NULL,
--   premium int NOT NULL DEFAULT 0,
--   loan_interest_rate decimal(5,2) NOT NULL DEFAULT 45, -- divide by 100 -> 4.5%
--   age_end_year smallint NOT NULL,
--   net_cash_value_end_year int NOT NULL,
--   net_death_benefit_end_year int NOT NULL,
--   annual_net_outlay int NOT NULL DEFAULT 0,
--   cumulative_net_outlay int NOT NULL DEFAULT 0,
--   net_annual_cash_value_increase int NOT NULL DEFAULT 0
-- );

-- ALTER TABLE insurance_policy_rows OWNER TO postgres;
-- ALTER TABLE insurance_policy_rows ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Admin can view insurance_policy_rows data" ON public.insurance_policy_rows
--   FOR SELECT
--   TO authenticated
--   USING (is_admin(auth.uid()));

-- CREATE POLICY "Admin can insert insurance_policy_rows" ON public.insurance_policy_rows
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (is_admin(auth.uid()));

-- CREATE POLICY "Admin can update insurance_policy_rows data" ON public.insurance_policy_rows
--   FOR UPDATE
--   TO authenticated
--   USING (is_admin(auth.uid()));

-- CREATE POLICY "Admin can delete insurance_policy_rows" ON public.insurance_policy_rows
--   FOR DELETE
--   TO authenticated
--   USING (is_admin(auth.uid()));



-- /**
--  *
--  * Insurance Policy Functions
--  *
--  */

-- -- Retrieves the policies and combines the user and company for viewing in the policies page
-- CREATE OR REPLACE FUNCTION get_all_user_insurance_policy_views()
-- RETURNS SETOF jsonb
-- AS $$
-- BEGIN
--   RETURN QUERY
--   SELECT jsonb_build_object(
--     'user', jsonb_build_object(
--       'id', u.id,
--       'name', u.name
--     ),
--     'policy', jsonb_build_object(
--       'id', ip.id,
--       'name', ip.name
--     ),
--     'company', jsonb_build_object(
--       'id', ic.id,
--       'name', ic.name
--     )
--   )
--   FROM users AS u
--   INNER JOIN insurance_policies AS ip ON u.id = ip.user_id
--   INNER JOIN insurance_companies AS ic ON ip.company_id = ic.id
--   ORDER BY ip.id;
-- END;
-- $$ LANGUAGE plpgsql SECURITY definer;

-- ALTER FUNCTION get_all_user_insurance_policy_views() OWNER TO postgres;

-- -- Creates the new policy then, with the new policy id, inserts all the rows for that policy
-- CREATE OR REPLACE FUNCTION create_insurance_policy(
--   p_user_id uuid,
--   p_company_id int,
--   p_name text,
--   p_policy_rows insurance_policy_rows[] -- Array of insurance_policy_rows
-- ) RETURNS void AS $$
-- DECLARE
--   my_policy_id int;
--   p_row insurance_policy_rows;
--   default_premium decimal(10,2);
-- BEGIN
--   -- Get the premium_deposit value from the user's personal_finance table
--   SELECT premium_deposit INTO default_premium FROM personal_finance WHERE user_id = p_user_id;

--   -- Insert into insurance_policies table and get the generated id
--   INSERT INTO insurance_policies (user_id, company_id, name)
--   VALUES (p_user_id, p_company_id, p_name)
--   RETURNING id INTO my_policy_id;

--   -- Loop through the array and insert rows into insurance_policy_rows table
--   FOREACH p_row IN ARRAY p_policy_rows LOOP
--     INSERT INTO insurance_policy_rows (
--       policy_id,
--       year,
--       premium,
--       loan_interest_rate,
--       age_end_year,
--       net_cash_value_end_year,
--       net_death_benefit_end_year,
--       annual_net_outlay,
--       cumulative_net_outlay,
--       net_annual_cash_value_increase
--     )
--     VALUES (
--       my_policy_id,
--       p_row.year,
--       COALESCE(p_row.premium, default_premium),
--       COALESCE(p_row.loan_interest_rate, 45), -- Use default value of 45 if p_row.loan_interest_rate is null
--       p_row.age_end_year,
--       p_row.net_cash_value_end_year,
--       p_row.net_death_benefit_end_year,
--       p_row.annual_net_outlay,
--       p_row.cumulative_net_outlay,
--       p_row.net_annual_cash_value_increase
--     );
--   END LOOP;
-- END;
-- $$ LANGUAGE plpgsql SECURITY definer;

-- ALTER FUNCTION create_insurance_policy(p_user_id uuid, p_company_id int, p_name text, p_policy_rows insurance_policy_rows[]) OWNER TO postgres;




/**
 *
 *  FUNCTIONS
 *
 */

-- Used to check if an email is used when inviting users in the Manager Users section
CREATE OR REPLACE FUNCTION is_email_used(email text)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM auth.users as a WHERE a.email = $1);
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION is_email_used(email text) OWNER TO postgres;



CREATE OR REPLACE FUNCTION get_transactions_with_account_name(ins_item_id text, offset_val int, limit_val int)
RETURNS TABLE (
    id text,
    item_id text,
    account_id text,
    name text,
    amount decimal(10,2),
    category category,
    date timestamp with time zone,
    account text
) AS $$
BEGIN
    RETURN QUERY
        SELECT
            t.id,
            t.item_id,
            t.account_id,
            t.name,
            t.amount,
            t.category,
            t.date,
            a.name AS account
        FROM
            plaid_transactions t
        INNER JOIN
            plaid_accounts a ON t.account_id = a.account_id
        WHERE
            t.item_id = ins_item_id AND a.enabled = true
        ORDER BY
            t.date DESC
        OFFSET
            offset_val
        LIMIT
            limit_val;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION get_transactions_with_account_name(ins_item_id text, offset_val int, limit_val int) OWNER TO postgres;


-- Retrieves all transactions for all accounts for the user except for transactions
-- from accounts that are disabled and returns them in a JSON object with the
-- following structure:
-- {
--   "personal": Transaction[],
--   "business": Transaction[]
-- }
CREATE OR REPLACE FUNCTION public.get_transactions_by_user_id(user_id uuid)
RETURNS JSON AS $$
DECLARE
  personal_transactions JSON;
  business_transactions JSON;
BEGIN
  SELECT COALESCE(
    json_agg(
      json_build_object(
        'id', pt.id,
        'item_id', pt.item_id,
        'name', pt.name,
        'amount', pt.amount,
        'category', pt.category,
        'date', pt.date
      )
    ),
    '[]'::JSON
  ) INTO personal_transactions
  FROM plaid_transactions pt
    INNER JOIN plaid_accounts pa ON pt.account_id = pa.account_id
    INNER JOIN plaid p ON p.item_id = pa.item_id
    INNER JOIN users u ON u.id = p.user_id
  WHERE
    pa.type = 'personal' AND
    u.id = $1 AND
    pa.enabled = true;

  SELECT COALESCE(
    json_agg(
      json_build_object(
        'id', pt.id,
        'item_id', pt.item_id,
        'name', pt.name,
        'amount', pt.amount,
        'category', pt.category,
        'date', pt.date
      )
    ),
    '[]'::JSON
  ) INTO business_transactions
  FROM plaid_transactions pt
    INNER JOIN plaid_accounts pa ON pt.account_id = pa.account_id
    INNER JOIN plaid p ON p.item_id = pa.item_id
    INNER JOIN users u ON u.id = p.user_id
  WHERE
    pa.type = 'business' AND
    u.id = $1 AND
    pa.enabled = true;

  RETURN json_build_object(
    'personal', personal_transactions,
    'business', business_transactions
  );
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION public.get_transactions_by_user_id(user_id uuid) OWNER TO postgres;



-- Function that retrieves the user's creative cash flow records by return a JSON object
-- with the following structure:
-- {
--   "id": int,
--   "inputs": CreativeCashFlowInputs[],
--   "results": CreativeCashFlowResults[]
-- }
-- and is sorted by the created date in descending order
CREATE OR REPLACE FUNCTION get_creative_cash_flow_records(arg_user_id uuid)
RETURNS TABLE(id uuid, inputs jsonb, results jsonb) AS $$
BEGIN
    RETURN QUERY
        SELECT
            cc.id,
            to_jsonb(inputs.*) AS inputs,
            to_jsonb(results.*) AS results
        FROM creative_cash_flow AS cc
        JOIN creative_cash_flow_inputs AS inputs
        ON cc.id = inputs.id
        JOIN creative_cash_flow_results AS results
        ON cc.id = results.id
        WHERE inputs.user_id = arg_user_id
        ORDER BY inputs.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION get_creative_cash_flow_records(arg_user_id uuid) OWNER TO postgres;



-- Function that retrieves s specific creative cash flow record in a JSON object
-- with the following structure:
-- {
--   "id": uuid,
--   "inputs": CreativeCashFlowInputs,
--   "results": CreativeCashFlowResults
-- }
CREATE OR REPLACE FUNCTION get_creative_cash_flow_record(record_id uuid)
RETURNS TABLE(id uuid, inputs jsonb, results jsonb) AS $$
BEGIN
    RETURN QUERY
        SELECT
            cc.id,
            to_jsonb(inputs.*) AS inputs,
            to_jsonb(results.*) AS results
        FROM creative_cash_flow AS cc
        JOIN creative_cash_flow_inputs AS inputs
        ON cc.id = inputs.id
        JOIN creative_cash_flow_results AS results
        ON cc.id = results.id
        WHERE cc.id = record_id;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION get_creative_cash_flow_record(record_id uuid) OWNER TO postgres;



-- Gets the running total of the user's WAA before the start date of the range used when
-- calculating the CCF
CREATE OR REPLACE FUNCTION total_waa_before_date(user_id uuid, target_date timestamp with time zone)
RETURNS NUMERIC AS $$
DECLARE
  total_waa_sum numeric;
BEGIN
  SELECT COALESCE(SUM(cfr.waa), 0)
  INTO total_waa_sum
  FROM creative_cash_flow_results cfr
  JOIN creative_cash_flow_inputs cci ON cfr.id = cci.id
  WHERE cfr.user_id = $1 AND cci.end_date <= target_date;

  RETURN total_waa_sum;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION total_waa_before_date(user_id uuid, target_date timestamp with time zone) OWNER TO postgres;



-- Updates a user's profile by first checking if the provided email is already in use and if it
-- is then it throws an exception. If it isn't then it updates the user's email and name. In
-- both the auth.users and public.users tables for emails and name in public.users.
CREATE OR REPLACE function update_user_profile(new_name text, new_email text)
RETURNS JSON AS $$
DECLARE
  user_id uuid;
BEGIN
  user_id := auth.uid();

  -- Check if the email is already in use
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = new_email AND id != user_id) THEN
    RAISE EXCEPTION 'Email already in use';
  END IF;

  -- Update the user's profile
  UPDATE auth.users SET email = LOWER(new_email) WHERE id = user_id;
  UPDATE public.users SET name = INITCAP(new_name), email = LOWER(new_email) WHERE id = user_id;

  -- Return the updated user's profile
  RETURN (SELECT row_to_json(u) FROM (SELECT name, email FROM public.users WHERE id = user_id) u);
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION update_user_profile(new_name text, new_email text) OWNER TO postgres;



-- Changes a user password by first checking if the provided current password matches and if it
-- doesn't then it throws an exception. If it does match then it updates the user's password
-- with the new one.
CREATE OR REPLACE function change_user_password(current_password text, new_password text)
RETURNS VOID AS $$
DECLARE
  user_id uuid;
BEGIN
  user_id := auth.uid();

  -- Check if the passwords match
  IF EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = user_id AND encrypted_password = crypt(current_password::text, auth.users.encrypted_password)
  ) THEN
    RAISE EXCEPTION 'Incorrect password';
  END IF;

  -- Then set the new password
  UPDATE auth.users SET encrypted_password = crypt(new_password, gen_salt('bf'))
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY definer;

ALTER FUNCTION change_user_password(current_password text, new_password text) OWNER TO postgres;
