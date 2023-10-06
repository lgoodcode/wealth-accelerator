
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

ALTER SCHEMA "public" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."account_type" AS ENUM (
    'personal',
    'business'
);

ALTER TYPE "public"."account_type" OWNER TO "postgres";

CREATE TYPE "public"."category" AS ENUM (
    'Transfer',
    'Money-In',
    'Money-Out'
);

ALTER TYPE "public"."category" OWNER TO "postgres";

CREATE TYPE "public"."debt_snowball_debt_payoff_debt" AS (
	"description" "text"
);

ALTER TYPE "public"."debt_snowball_debt_payoff_debt" OWNER TO "postgres";

CREATE TYPE "public"."debt_snowball_debt_payoff" AS (
	"debt" "public"."debt_snowball_debt_payoff_debt",
	"payment_tracking" numeric(12,2)[]
);

ALTER TYPE "public"."debt_snowball_debt_payoff" OWNER TO "postgres";

CREATE TYPE "public"."current_calculation_results" AS (
	"debt_payoffs" "public"."debt_snowball_debt_payoff"[],
	"balance_tracking" numeric(12,2)[],
	"interest_tracking" numeric(12,2)[],
	"payoff_months" integer,
	"total_interest" numeric(12,2),
	"total_amount" numeric(12,2)
);

ALTER TYPE "public"."current_calculation_results" OWNER TO "postgres";

CREATE TYPE "public"."debt_snowball_debt" AS (
	"description" "text",
	"amount" numeric(12,2),
	"payment" numeric(12,2),
	"interest" numeric(5,2),
	"months_remaining" smallint
);

ALTER TYPE "public"."debt_snowball_debt" OWNER TO "postgres";

CREATE TYPE "public"."debt_snowball_inputs_data" AS (
	"additional_payment" numeric(12,2),
	"monthly_payment" numeric(12,2),
	"opportunity_rate" numeric(5,2),
	"strategy" "text",
	"lump_amounts" numeric(12,2)[],
	"pay_back_loan" boolean,
	"pay_interest" boolean,
	"loan_interest_rate" numeric(5,2)
);

ALTER TYPE "public"."debt_snowball_inputs_data" OWNER TO "postgres";

CREATE TYPE "public"."loan_payback_type" AS (
	"total" numeric(12,2),
	"interest" numeric(12,2),
	"months" integer,
	"tracking" numeric(12,2)[]
);

ALTER TYPE "public"."loan_payback_type" OWNER TO "postgres";

CREATE TYPE "public"."strategy_calculation_results" AS (
	"debt_payoffs" "public"."debt_snowball_debt_payoff"[],
	"balance_tracking" numeric(12,2)[],
	"interest_tracking" numeric(12,2)[],
	"payoff_months" integer,
	"total_interest" numeric(12,2),
	"total_amount" numeric(12,2),
	"snowball_tracking" numeric(12,2)[],
	"loan_payback" "public"."loan_payback_type"
);

ALTER TYPE "public"."strategy_calculation_results" OWNER TO "postgres";

CREATE TYPE "public"."debt_snowball_results_data" AS (
	"current" "public"."current_calculation_results",
	"strategy" "public"."strategy_calculation_results"
);

ALTER TYPE "public"."debt_snowball_results_data" OWNER TO "postgres";

CREATE TYPE "public"."user_role" AS ENUM (
    'USER',
    'ADMIN'
);

ALTER TYPE "public"."user_role" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."change_user_password"("current_password" "text", "new_password" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;

ALTER FUNCTION "public"."change_user_password"("current_password" "text", "new_password" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_creative_cash_flow"("_user_id" "uuid", "_start_date" timestamp with time zone, "_end_date" timestamp with time zone, "_all_other_income" numeric, "_payroll_and_distributions" numeric, "_lifestyle_expenses_tax_rate" numeric, "_tax_account_rate" numeric, "_optimal_savings_strategy" numeric, "_collections" numeric, "_lifestyle_expenses" numeric, "_lifestyle_expenses_tax" numeric, "_business_profit_before_tax" numeric, "_business_overhead" numeric, "_tax_account" numeric, "_waa" numeric, "_total_waa" numeric, "_daily_trend" numeric[], "_weekly_trend" numeric[], "_yearly_trend" numeric[], "_year_to_date" numeric) RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
  VALUES (new_id, _user_id, _collections, _lifestyle_expenses, _lifestyle_expenses_tax, _business_profit_before_tax, _business_overhead, _tax_account, _waa, _total_waa, _daily_trend, _weekly_trend, _yearly_trend, _year_to_date);

  RETURN new_id;
END;
$$;

ALTER FUNCTION "public"."create_creative_cash_flow"("_user_id" "uuid", "_start_date" timestamp with time zone, "_end_date" timestamp with time zone, "_all_other_income" numeric, "_payroll_and_distributions" numeric, "_lifestyle_expenses_tax_rate" numeric, "_tax_account_rate" numeric, "_optimal_savings_strategy" numeric, "_collections" numeric, "_lifestyle_expenses" numeric, "_lifestyle_expenses_tax" numeric, "_business_profit_before_tax" numeric, "_business_overhead" numeric, "_tax_account" numeric, "_waa" numeric, "_total_waa" numeric, "_daily_trend" numeric[], "_weekly_trend" numeric[], "_yearly_trend" numeric[], "_year_to_date" numeric) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_debt_snowball_record"("user_id" "uuid", "name" "text", "debts" "public"."debt_snowball_debt"[], "inputs" "public"."debt_snowball_inputs_data", "results" "public"."debt_snowball_results_data") RETURNS TABLE("new_id" "uuid", "new_created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  new_id uuid;
  new_created_at timestamp with time zone;
BEGIN
  -- Generate a new UUID using the uuid-ossp extension
  SELECT uuid_generate_v4() INTO new_id;

  INSERT INTO debt_snowball (id, user_id, name, debts, created_at)
  VALUES (new_id, user_id, name, debts, NOW())
  RETURNING created_at INTO new_created_at;

  INSERT INTO debt_snowball_inputs (id, additional_payment, monthly_payment, opportunity_rate, strategy, lump_amounts, pay_back_loan, pay_interest, loan_interest_rate)
  VALUES (new_id, inputs.additional_payment, inputs.monthly_payment, inputs.opportunity_rate, inputs.strategy, inputs.lump_amounts, inputs.pay_back_loan, inputs.pay_interest, inputs.loan_interest_rate);

  INSERT INTO debt_snowball_results (id, current, strategy)
  VALUES (new_id, results.current, results.strategy);

  RETURN QUERY SELECT new_id, new_created_at;
END;
$$;

ALTER FUNCTION "public"."create_debt_snowball_record"("user_id" "uuid", "name" "text", "debts" "public"."debt_snowball_debt"[], "inputs" "public"."debt_snowball_inputs_data", "results" "public"."debt_snowball_results_data") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."global_plaid_filters" (
    "id" integer NOT NULL,
    "filter" "text" NOT NULL,
    "category" "public"."category" NOT NULL
);

ALTER TABLE "public"."global_plaid_filters" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_global_plaid_filter"("_filter" "public"."global_plaid_filters", "override" boolean) RETURNS "public"."global_plaid_filters"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  new_filter global_plaid_filters;
BEGIN
  INSERT INTO global_plaid_filters (filter, category)
  VALUES (_filter.filter, _filter.category)
  RETURNING * INTO new_filter;

  -- Create a temporary table of transaction id's that match the filter, don't already
  -- have a user filter applied, and if the override flag is set, include transactions
  -- that have a global filter, otherwise, skip those
  CREATE TEMP TABLE temp_transactions AS
  SELECT pt.id
  FROM plaid_transactions pt
  JOIN plaid p ON p.item_id = pt.item_id
  WHERE
    pt.user_filter_id IS NULL
    AND CASE
      WHEN override = FALSE THEN pt.global_filter_id IS NULL
      ELSE TRUE
    END
    AND LOWER(pt.name) LIKE '%' || LOWER(_filter.filter) || '%';

  UPDATE plaid_transactions pt
  SET category = _filter.category,
    global_filter_id = new_filter.id
  FROM temp_transactions tt
  WHERE pt.id = tt.id;

  DROP TABLE temp_transactions;
  RETURN new_filter;
END;
$$;

ALTER FUNCTION "public"."create_global_plaid_filter"("_filter" "public"."global_plaid_filters", "override" boolean) OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_plaid_filters" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "filter" "text" NOT NULL,
    "category" "public"."category" NOT NULL
);

ALTER TABLE "public"."user_plaid_filters" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_user_plaid_filter"("_filter" "public"."user_plaid_filters", "user_override" boolean, "global_override" boolean) RETURNS "public"."user_plaid_filters"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  new_filter user_plaid_filters;
BEGIN
  INSERT INTO user_plaid_filters (user_id, filter, category)
  VALUES (_filter.user_id, _filter.filter, _filter.category)
  RETURNING * INTO new_filter;

  -- Create a temporary table of transaction id's that belong to the user and match the filter
  CREATE TEMP TABLE temp_transactions AS
  SELECT pt.id
  FROM plaid_transactions pt
  JOIN plaid p ON p.item_id = pt.item_id
  WHERE p.user_id = _filter.user_id
    AND LOWER(pt.name) LIKE '%' || LOWER(_filter.filter) || '%';

  -- Override any filter
  IF user_override AND global_override THEN
    UPDATE plaid_transactions pt
    SET category = _filter.category,
      user_filter_id = new_filter.id,
      global_filter_id = NULL
    FROM temp_transactions tt
    WHERE pt.id = tt.id;
  -- Override any existing user filter but not existing global
  ELSIF user_override THEN
    UPDATE plaid_transactions pt
    SET category = _filter.category, user_filter_id = new_filter.id
    FROM temp_transactions tt
    WHERE pt.id = tt.id AND global_filter_id IS NULL;
  -- Override any existing global filter but not existing user
  ELSIF global_override THEN
    UPDATE plaid_transactions pt
    SET category = _filter.category,
      user_filter_id = new_filter.id,
      global_filter_id = NULL
    FROM temp_transactions tt
    WHERE pt.id = tt.id AND user_filter_id IS NULL;
  -- Only update transactions that don't have a filter
  ELSE
    UPDATE plaid_transactions pt
    SET category = _filter.category, user_filter_id = new_filter.id
    FROM temp_transactions tt
    WHERE pt.id = tt.id
      AND user_filter_id IS NULL
      AND global_filter_id IS NULL;
  END IF;

  DROP TABLE temp_transactions;
  RETURN new_filter;
END;
$$;

ALTER FUNCTION "public"."create_user_plaid_filter"("_filter" "public"."user_plaid_filters", "user_override" boolean, "global_override" boolean) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."delete_global_plaid_filter"("filter_id" integer, "new_filter_id" integer DEFAULT NULL::integer) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  new_global_filter global_plaid_filters;
BEGIN
  IF new_filter_id IS NOT NULL THEN
    SELECT * FROM global_plaid_filters WHERE id = new_filter_id INTO new_global_filter;

    UPDATE plaid_transactions
    SET
      category = new_global_filter.category,
      global_filter_id = new_global_filter.id
    WHERE global_filter_id = filter_id;
  ELSE
    UPDATE plaid_transactions
    SET
      category = CASE
        WHEN amount < 0 THEN 'Money-In'::category
        ELSE 'Money-Out'::category
      END,
      global_filter_id = NULL
    WHERE global_filter_id = filter_id;
  END IF;

  DELETE FROM global_plaid_filters WHERE id = filter_id;
END;
$$;

ALTER FUNCTION "public"."delete_global_plaid_filter"("filter_id" integer, "new_filter_id" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."delete_user_plaid_filter"("filter_id" integer, "global_filter_id" integer DEFAULT NULL::integer) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  global_filter global_plaid_filters;
BEGIN
  IF global_filter_id IS NOT NULL THEN
    SELECT * FROM global_plaid_filters WHERE id = global_filter_id INTO global_filter;

    UPDATE plaid_transactions
    SET
      category = global_filter.category,
      global_filter_id = global_filter.id,
      user_filter_id = NULL
    WHERE user_filter_id = filter_id;
  ELSE
    UPDATE plaid_transactions
    SET
      category = CASE
        WHEN amount < 0 THEN 'Money-In'::category
        ELSE 'Money-Out'::category
      END,
      global_filter_id = NULL,
      user_filter_id = NULL
    WHERE user_filter_id = filter_id;
  END IF;

  DELETE FROM user_plaid_filters WHERE id = filter_id;
END;
$$;

ALTER FUNCTION "public"."delete_user_plaid_filter"("filter_id" integer, "global_filter_id" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."format_transaction"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  NEW.date = NEW.date + INTERVAL '7 hours'; -- Add 7 hours to get it to proper UTC time format
  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."format_transaction"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."generate_rates"() RETURNS numeric[]
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN ARRAY(SELECT 7::decimal(5,2) FROM generate_series(1, 60));
END
$$;

ALTER FUNCTION "public"."generate_rates"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_creative_cash_flow_record"("record_id" "uuid") RETURNS TABLE("id" "uuid", "inputs" "jsonb", "results" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
        SELECT
            cc.id,
            to_jsonb(ccfi.*) AS inputs,
            to_jsonb(ccfr.*) AS results
        FROM creative_cash_flow cc
        JOIN creative_cash_flow_inputs ccfi ON cc.id = ccfi.id
        JOIN creative_cash_flow_results ccfr ON cc.id = ccfr.id
        WHERE cc.id = record_id;
END;
$$;

ALTER FUNCTION "public"."get_creative_cash_flow_record"("record_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_creative_cash_flow_records"("arg_user_id" "uuid") RETURNS TABLE("id" "uuid", "inputs" "jsonb", "results" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
        SELECT
            cc.id,
            to_jsonb(ccfi.*) AS ccfi,
            to_jsonb(ccfr.*) AS ccfr
        FROM creative_cash_flow cc
        JOIN creative_cash_flow_inputs ccfi ON cc.id = ccfi.id
        JOIN creative_cash_flow_results ccfr ON cc.id = ccfr.id
        WHERE ccfi.user_id = arg_user_id
        ORDER BY ccfi.created_at DESC;
END;
$$;

ALTER FUNCTION "public"."get_creative_cash_flow_records"("arg_user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_debt_snowball_record"("record_id" "uuid") RETURNS TABLE("id" "uuid", "user_id" "uuid", "name" "text", "created_at" timestamp with time zone, "debts" "public"."debt_snowball_debt"[], "inputs" "json", "results" "json")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
    SELECT
      ds.id,
      ds.user_id,
      ds.name,
      ds.created_at,
      ds.debts,
      json_build_object(
        'additional_payment', dsi.additional_payment,
        'monthly_payment', dsi.monthly_payment,
        'opportunity_rate', dsi.opportunity_rate,
        'strategy', dsi.strategy,
        'lump_amounts', dsi.lump_amounts,
        'pay_back_loan', dsi.pay_back_loan,
        'pay_interest', dsi.pay_interest,
        'loan_interest_rate', dsi.loan_interest_rate
      ) AS debt_snowball_inputs_data,
      json_build_object(
        'current', dsr.current,
        'strategy', dsr.strategy
      ) AS debt_snowball_results_data
  FROM debt_snowball ds
  JOIN debt_snowball_inputs dsi ON ds.id = dsi.id
  JOIN debt_snowball_results dsr ON ds.id = dsr.id
  WHERE ds.id = record_id;
END;
$$;

ALTER FUNCTION "public"."get_debt_snowball_record"("record_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_debt_snowball_records"("_user_id" "uuid") RETURNS TABLE("id" "uuid", "user_id" "uuid", "name" "text", "created_at" timestamp with time zone, "debts" "public"."debt_snowball_debt"[], "inputs" "json", "results" "json")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
    SELECT
      ds.id,
      ds.user_id,
      ds.name,
      ds.created_at,
      ds.debts,
      json_build_object(
        'additional_payment', dsi.additional_payment,
        'monthly_payment', dsi.monthly_payment,
        'opportunity_rate', dsi.opportunity_rate,
        'strategy', dsi.strategy,
        'lump_amounts', dsi.lump_amounts,
        'pay_back_loan', dsi.pay_back_loan,
        'pay_interest', dsi.pay_interest,
        'loan_interest_rate', dsi.loan_interest_rate
      ) AS debt_snowball_inputs_data,
      json_build_object(
        'current', dsr.current,
        'strategy', dsr.strategy
      ) AS debt_snowball_results_data
  FROM debt_snowball ds
  JOIN debt_snowball_inputs dsi ON ds.id = dsi.id
  JOIN debt_snowball_results dsr ON ds.id = dsr.id
  WHERE ds.user_id = _user_id;
END;
$$;

ALTER FUNCTION "public"."get_debt_snowball_records"("_user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_manage_users"() RETURNS TABLE("id" "uuid", "name" "text", "email" "text", "role" "public"."user_role", "confirmed_email" boolean, "created_at" timestamp with time zone, "updated_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
    SELECT
      u.id,
      u.name,
      u.email,
      u.role,
      (au.email_confirmed_at IS NOT NULL),
      u.created_at,
      u.updated_at
    FROM public.users u
    JOIN auth.users au ON u.id = au.id
    ORDER BY
      u.created_at ASC;
END;
$$;

ALTER FUNCTION "public"."get_manage_users"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_transactions_by_user_id"("user_id" "uuid") RETURNS "json"
    LANGUAGE "plpgsql"
    AS $_$
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
$_$;

ALTER FUNCTION "public"."get_transactions_by_user_id"("user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_transactions_with_account_name"("ins_item_id" "text", "offset_val" integer, "limit_val" integer) RETURNS TABLE("id" "text", "item_id" "text", "account_id" "text", "name" "text", "amount" numeric, "category" "public"."category", "date" timestamp with time zone, "account" "text")
    LANGUAGE "plpgsql"
    AS $$
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
$$;

ALTER FUNCTION "public"."get_transactions_with_account_name"("ins_item_id" "text", "offset_val" integer, "limit_val" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_init_personal_finance"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Insert a new row into the personal_finance table for the new user
  INSERT INTO public.personal_finance (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."handle_init_personal_finance"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    LOWER(NEW.email),
    INITCAP(NEW.raw_user_meta_data->>'name')
  );
  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE auth.uid() = id AND role = 'ADMIN'::user_role
  );
END;
$$;

ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."is_admin"("user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  PERFORM
  FROM public.users
  WHERE id = user_id AND role = 'ADMIN'::user_role;
  RETURN FOUND;
END;
$$;

ALTER FUNCTION "public"."is_admin"("user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."is_authenticated"() RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN auth.uid() IS NOT NULL;
END;
$$;

ALTER FUNCTION "public"."is_authenticated"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."is_email_used"("email" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
BEGIN
  RETURN EXISTS (SELECT 1 FROM auth.users as a WHERE a.email = $1);
END;
$_$;

ALTER FUNCTION "public"."is_email_used"("email" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."is_own_plaid_account"() RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM plaid p
    WHERE p.item_id = item_id AND p.user_id = auth.uid()
  );
END;
$$;

ALTER FUNCTION "public"."is_own_plaid_account"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."is_own_plaid_transaction"() RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM plaid p
    WHERE p.item_id = item_id AND p.user_id = auth.uid()
  );
END;
$$;

ALTER FUNCTION "public"."is_own_plaid_transaction"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."owns_debt_snowball_inputs"() RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM debt_snowball AS ds
    WHERE ds.id = id AND auth.uid() = ds.user_id
  );
END;
$$;

ALTER FUNCTION "public"."owns_debt_snowball_inputs"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."owns_debt_snowball_results"() RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM debt_snowball AS ds
    WHERE ds.id = id AND auth.uid() = ds.user_id
  );
END;
$$;

ALTER FUNCTION "public"."owns_debt_snowball_results"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."recategorize_transactions"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;

ALTER FUNCTION "public"."recategorize_transactions"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."total_waa_before_date"("user_id" "uuid", "target_date" timestamp with time zone) RETURNS numeric
    LANGUAGE "plpgsql"
    AS $_$
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
$_$;

ALTER FUNCTION "public"."total_waa_before_date"("user_id" "uuid", "target_date" timestamp with time zone) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_global_plaid_filter"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.id <> OLD.id THEN
    RAISE EXCEPTION 'Updating "id" is not allowed';
  END IF;
  IF NEW.filter <> OLD.filter THEN
    RAISE EXCEPTION 'Updating "filter" is not allowed';
  END IF;

  UPDATE plaid_transactions
  SET category = NEW.category
  WHERE global_filter_id = NEW.id;

  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_global_plaid_filter"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_transaction_categories"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE plaid_transactions
  SET category = NEW.category
  WHERE name ILIKE '%' || NEW.filter || '%';
  RETURN NULL;
END;
$$;

ALTER FUNCTION "public"."update_transaction_categories"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_user_plaid_filter"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.id <> OLD.id THEN
    RAISE EXCEPTION 'Updating "id" is not allowed';
  END IF;
  IF NEW.user_id <> OLD.user_id THEN
    RAISE EXCEPTION 'Updating "user_id" is not allowed';
  END IF;
  IF NEW.filter <> OLD.filter THEN
    RAISE EXCEPTION 'Updating "filter" is not allowed';
  END IF;

  UPDATE plaid_transactions
  SET category = NEW.category
  WHERE user_filter_id = NEW.id;

  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_user_plaid_filter"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_user_profile"("new_name" "text", "new_email" "text") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;

ALTER FUNCTION "public"."update_user_profile"("new_name" "text", "new_email" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."verify_update_debt_snowball"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.id <> OLD.id THEN
    RAISE EXCEPTION 'Updating "id" is not allowed';
  END IF;
  IF NEW.user_id <> OLD.user_id THEN
    RAISE EXCEPTION 'Updating "user_id" is not allowed';
  END IF;
  IF NEW.debts <> OLD.debts THEN
    RAISE EXCEPTION 'Updating "debts" is not allowed';
  END IF;
  IF NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'Updating "created_at" is not allowed';
  END IF;

  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."verify_update_debt_snowball"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."verify_update_plaid"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.item_id <> OLD.item_id THEN
    RAISE EXCEPTION 'Updating "item_id" is not allowed';
  END IF;
  IF NEW.user_id <> OLD.user_id THEN
    RAISE EXCEPTION 'Updating "user_id" is not allowed';
  END IF;
  IF NEW.access_token <> OLD.access_token THEN
    RAISE EXCEPTION 'Updating "access_token" is not allowed';
  END IF;

  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."verify_update_plaid"() OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."creative_cash_flow" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL
);

ALTER TABLE "public"."creative_cash_flow" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."creative_cash_flow_inputs" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "start_date" timestamp with time zone NOT NULL,
    "end_date" timestamp with time zone NOT NULL,
    "all_other_income" numeric(12,2) NOT NULL,
    "payroll_and_distributions" numeric(12,2) NOT NULL,
    "lifestyle_expenses_tax_rate" numeric(5,2) NOT NULL,
    "tax_account_rate" numeric(5,2) NOT NULL,
    "optimal_savings_strategy" numeric(12,2) NOT NULL
);

ALTER TABLE "public"."creative_cash_flow_inputs" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."creative_cash_flow_results" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "collections" numeric(12,2) NOT NULL,
    "lifestyle_expenses" numeric(12,2) NOT NULL,
    "lifestyle_expenses_tax" numeric(12,2) NOT NULL,
    "business_profit_before_tax" numeric(12,2) NOT NULL,
    "business_overhead" numeric(12,2) NOT NULL,
    "tax_account" numeric(12,2) NOT NULL,
    "waa" numeric(12,2) NOT NULL,
    "total_waa" numeric(12,2) NOT NULL,
    "weekly_trend" numeric(12,2)[] NOT NULL,
    "daily_trend" numeric(12,2)[] NOT NULL,
    "yearly_trend" numeric(12,2)[] NOT NULL,
    "year_to_date" numeric(12,2) NOT NULL
);

ALTER TABLE "public"."creative_cash_flow_results" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."debt_snowball" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "debts" "public"."debt_snowball_debt"[] NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."debt_snowball" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."debt_snowball_inputs" (
    "id" "uuid" NOT NULL,
    "additional_payment" numeric(12,2) NOT NULL,
    "monthly_payment" numeric(12,2) NOT NULL,
    "opportunity_rate" numeric(5,2) NOT NULL,
    "strategy" "text" NOT NULL,
    "lump_amounts" numeric(12,2)[] NOT NULL,
    "pay_back_loan" boolean NOT NULL,
    "pay_interest" boolean NOT NULL,
    "loan_interest_rate" numeric(5,2) NOT NULL
);

ALTER TABLE "public"."debt_snowball_inputs" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."debt_snowball_results" (
    "id" "uuid" NOT NULL,
    "current" "public"."current_calculation_results" NOT NULL,
    "strategy" "public"."strategy_calculation_results" NOT NULL
);

ALTER TABLE "public"."debt_snowball_results" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."debt_snowballs" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "debts" "public"."debt_snowball_debt"[] NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."debt_snowballs" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."debts" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "description" "text" NOT NULL,
    "amount" numeric(12,2) NOT NULL,
    "payment" numeric(12,2) NOT NULL,
    "interest" numeric(5,2) NOT NULL,
    "months_remaining" smallint DEFAULT '0'::smallint NOT NULL
);

ALTER TABLE "public"."debts" OWNER TO "postgres";

ALTER TABLE "public"."debts" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."debts_id_seq1"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."global_plaid_filters" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."global_plaid_filters_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."notifiers" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "contact_email" boolean DEFAULT false NOT NULL,
    "creative_cash_flow" boolean DEFAULT false NOT NULL,
    "debt_snowball" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."notifiers" OWNER TO "postgres";

ALTER TABLE "public"."notifiers" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."notifiers_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."personal_finance" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "start_date" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "rates" numeric[] DEFAULT "public"."generate_rates"() NOT NULL,
    "stop_invest" smallint DEFAULT 10 NOT NULL,
    "start_withdrawl" smallint DEFAULT 20 NOT NULL,
    "money_needed_to_live" integer DEFAULT 100000 NOT NULL,
    "tax_bracket" smallint DEFAULT 25 NOT NULL,
    "tax_bracket_future" smallint DEFAULT 30 NOT NULL,
    "premium_deposit" integer DEFAULT 50000 NOT NULL,
    "ytd_collections" integer DEFAULT 0 NOT NULL,
    "default_tax_rate" smallint DEFAULT '25'::smallint NOT NULL
);

ALTER TABLE "public"."personal_finance" OWNER TO "postgres";

ALTER TABLE "public"."personal_finance" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."personal_finance_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."plaid" (
    "item_id" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "access_token" "text" NOT NULL,
    "expiration" timestamp with time zone NOT NULL,
    "cursor" "text"
);

ALTER TABLE "public"."plaid" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."plaid_accounts" (
    "account_id" "text" NOT NULL,
    "item_id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "public"."account_type" DEFAULT 'business'::"public"."account_type" NOT NULL,
    "enabled" boolean DEFAULT true NOT NULL
);

ALTER TABLE "public"."plaid_accounts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."plaid_transactions" (
    "id" "text" NOT NULL,
    "item_id" "text" NOT NULL,
    "account_id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "amount" numeric(12,2) NOT NULL,
    "category" "public"."category" NOT NULL,
    "date" timestamp with time zone NOT NULL,
    "user_filter_id" integer,
    "global_filter_id" integer
);

ALTER TABLE "public"."plaid_transactions" OWNER TO "postgres";

ALTER TABLE "public"."user_plaid_filters" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_plaid_filters_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "role" "public"."user_role" DEFAULT 'USER'::"public"."user_role" NOT NULL,
    "email" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE ONLY "public"."plaid"
    ADD CONSTRAINT "access_token_unique" UNIQUE ("access_token");

ALTER TABLE ONLY "public"."creative_cash_flow_inputs"
    ADD CONSTRAINT "creative_cash_flow_inputs_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."creative_cash_flow"
    ADD CONSTRAINT "creative_cash_flow_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."creative_cash_flow_results"
    ADD CONSTRAINT "creative_cash_flow_results_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."debt_snowball_inputs"
    ADD CONSTRAINT "debt_snowball_inputs_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."debt_snowball"
    ADD CONSTRAINT "debt_snowball_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."debt_snowball_results"
    ADD CONSTRAINT "debt_snowball_results_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."debt_snowballs"
    ADD CONSTRAINT "debt_snowballs_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."debts"
    ADD CONSTRAINT "debts_pkey1" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."global_plaid_filters"
    ADD CONSTRAINT "global_plaid_filters_filter_key" UNIQUE ("filter");

ALTER TABLE ONLY "public"."global_plaid_filters"
    ADD CONSTRAINT "global_plaid_filters_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."notifiers"
    ADD CONSTRAINT "notifiers_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."notifiers"
    ADD CONSTRAINT "notifiers_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."personal_finance"
    ADD CONSTRAINT "personal_finance_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."plaid_accounts"
    ADD CONSTRAINT "plaid_accounts_pkey" PRIMARY KEY ("account_id");

ALTER TABLE ONLY "public"."plaid"
    ADD CONSTRAINT "plaid_pkey" PRIMARY KEY ("item_id");

ALTER TABLE ONLY "public"."plaid_transactions"
    ADD CONSTRAINT "plaid_transactions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_plaid_filters"
    ADD CONSTRAINT "user_plaid_filters_filter_key" UNIQUE ("filter");

ALTER TABLE ONLY "public"."user_plaid_filters"
    ADD CONSTRAINT "user_plaid_filters_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

CREATE INDEX "idx_debt_snowball_user_id" ON "public"."debt_snowball" USING "btree" ("user_id");

CREATE INDEX "idx_debts_user_id" ON "public"."debts" USING "btree" ("user_id");

CREATE INDEX "idx_personal_finance_user_id" ON "public"."personal_finance" USING "btree" ("user_id");

CREATE INDEX "idx_plaid_accounts_item_id" ON "public"."plaid_accounts" USING "btree" ("item_id");

CREATE INDEX "idx_plaid_transactions_account_id" ON "public"."plaid_transactions" USING "btree" ("account_id");

CREATE INDEX "idx_plaid_transactions_global_filter_id" ON "public"."plaid_transactions" USING "btree" ("global_filter_id");

CREATE INDEX "idx_plaid_transactions_item_id" ON "public"."plaid_transactions" USING "btree" ("item_id");

CREATE INDEX "idx_plaid_transactions_user_filter_id" ON "public"."plaid_transactions" USING "btree" ("user_filter_id");

CREATE INDEX "idx_plaid_user_id" ON "public"."plaid" USING "btree" ("user_id");

CREATE TRIGGER "on_insert_plaid_transactions" BEFORE INSERT ON "public"."plaid_transactions" FOR EACH ROW EXECUTE FUNCTION "public"."format_transaction"();

CREATE TRIGGER "on_update_debt_snowball" BEFORE UPDATE ON "public"."debt_snowball" FOR EACH ROW EXECUTE FUNCTION "public"."verify_update_debt_snowball"();

CREATE TRIGGER "on_update_global_plaid_filter" BEFORE UPDATE ON "public"."global_plaid_filters" FOR EACH ROW EXECUTE FUNCTION "public"."update_global_plaid_filter"();

CREATE TRIGGER "on_update_plaid" BEFORE UPDATE ON "public"."plaid" FOR EACH ROW EXECUTE FUNCTION "public"."verify_update_plaid"();

CREATE TRIGGER "on_update_user_plaid_filter" BEFORE UPDATE ON "public"."user_plaid_filters" FOR EACH ROW EXECUTE FUNCTION "public"."update_user_plaid_filter"();

CREATE TRIGGER "on_user_created_init_personal_finance" AFTER INSERT ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_init_personal_finance"();

ALTER TABLE ONLY "public"."creative_cash_flow_inputs"
    ADD CONSTRAINT "creative_cash_flow_inputs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."creative_cash_flow_results"
    ADD CONSTRAINT "creative_cash_flow_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."creative_cash_flow"
    ADD CONSTRAINT "creative_cash_flow_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."debt_snowball_inputs"
    ADD CONSTRAINT "debt_snowball_inputs_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."debt_snowball"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."debt_snowball_results"
    ADD CONSTRAINT "debt_snowball_results_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."debt_snowball"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."debt_snowball"
    ADD CONSTRAINT "debt_snowball_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."debt_snowballs"
    ADD CONSTRAINT "debt_snowballs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."debts"
    ADD CONSTRAINT "debts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."personal_finance"
    ADD CONSTRAINT "personal_finance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."plaid_accounts"
    ADD CONSTRAINT "plaid_accounts_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."plaid"("item_id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."plaid_transactions"
    ADD CONSTRAINT "plaid_transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."plaid_accounts"("account_id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."plaid_transactions"
    ADD CONSTRAINT "plaid_transactions_global_filter_id_fkey" FOREIGN KEY ("global_filter_id") REFERENCES "public"."global_plaid_filters"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."plaid_transactions"
    ADD CONSTRAINT "plaid_transactions_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."plaid"("item_id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."plaid_transactions"
    ADD CONSTRAINT "plaid_transactions_user_filter_id_fkey" FOREIGN KEY ("user_filter_id") REFERENCES "public"."user_plaid_filters"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."plaid"
    ADD CONSTRAINT "plaid_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."user_plaid_filters"
    ADD CONSTRAINT "user_plaid_filters_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

CREATE POLICY "Admins can delete global plaid filters" ON "public"."global_plaid_filters" FOR DELETE TO "authenticated" USING (( SELECT "public"."is_admin"() AS "is_admin"));

CREATE POLICY "Admins can delete notifiers" ON "public"."notifiers" FOR DELETE TO "authenticated" USING (( SELECT "public"."is_admin"() AS "is_admin"));

CREATE POLICY "Admins can delete users" ON "public"."users" FOR DELETE TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "Admins can insert global plaid filters" ON "public"."global_plaid_filters" FOR INSERT TO "authenticated" WITH CHECK (( SELECT "public"."is_admin"() AS "is_admin"));

CREATE POLICY "Admins can insert notifiers" ON "public"."notifiers" FOR INSERT TO "authenticated" WITH CHECK (( SELECT "public"."is_admin"() AS "is_admin"));

CREATE POLICY "Admins can update global plaid filters" ON "public"."global_plaid_filters" FOR UPDATE TO "authenticated" USING (( SELECT "public"."is_admin"() AS "is_admin"));

CREATE POLICY "Admins can update notifiers" ON "public"."notifiers" FOR UPDATE TO "authenticated" USING (( SELECT "public"."is_admin"() AS "is_admin"));

CREATE POLICY "Admins can view notifiers" ON "public"."notifiers" FOR SELECT TO "authenticated" USING (( SELECT "public"."is_admin"() AS "is_admin"));

CREATE POLICY "Can delete own CCF data" ON "public"."creative_cash_flow" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Can delete own CCF inputs" ON "public"."creative_cash_flow_inputs" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Can delete own CCF results" ON "public"."creative_cash_flow_results" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Can delete own debt snowball data" ON "public"."debt_snowball" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Can delete own debt snowball data" ON "public"."debt_snowballs" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Can delete own debt snowball input data" ON "public"."debt_snowball_inputs" FOR DELETE TO "authenticated" USING (( SELECT "public"."owns_debt_snowball_inputs"() AS "owns_debt_snowball_inputs"));

CREATE POLICY "Can delete own debt snowball results" ON "public"."debt_snowball_results" FOR DELETE TO "authenticated" USING (( SELECT "public"."owns_debt_snowball_results"() AS "owns_debt_snowball_results"));

CREATE POLICY "Can delete own debts" ON "public"."debts" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Can delete own institutions" ON "public"."plaid" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Can delete own plaid accounts" ON "public"."plaid_accounts" FOR DELETE TO "authenticated" USING ("public"."is_own_plaid_account"());

CREATE POLICY "Can delete own plaid transactions" ON "public"."plaid_transactions" FOR DELETE TO "authenticated" USING ("public"."is_own_plaid_transaction"());

CREATE POLICY "Can insert new CCF data" ON "public"."creative_cash_flow" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Can insert new CCF inputs" ON "public"."creative_cash_flow_inputs" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Can insert new CCF results" ON "public"."creative_cash_flow_results" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Can insert new debt snowball data" ON "public"."debt_snowball" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Can insert new debt snowball data" ON "public"."debt_snowballs" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Can insert new debt snowball input data" ON "public"."debt_snowball_inputs" FOR INSERT TO "authenticated" WITH CHECK (( SELECT "public"."owns_debt_snowball_inputs"() AS "owns_debt_snowball_inputs"));

CREATE POLICY "Can insert new debt snowball results" ON "public"."debt_snowball_results" FOR INSERT TO "authenticated" WITH CHECK (( SELECT "public"."owns_debt_snowball_results"() AS "owns_debt_snowball_results"));

CREATE POLICY "Can insert new debts" ON "public"."debts" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Can insert new institutions" ON "public"."plaid" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Can insert own plaid accounts" ON "public"."plaid_accounts" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_own_plaid_account"());

CREATE POLICY "Can insert own plaid transactions" ON "public"."plaid_transactions" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_own_plaid_transaction"());

CREATE POLICY "Can update own CCF data" ON "public"."creative_cash_flow" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Can update own debt data" ON "public"."debts" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Can update own debt snowball data" ON "public"."debt_snowball" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Can update own debt snowball data" ON "public"."debt_snowballs" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Can update own institutions" ON "public"."plaid" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Can update own personal finances" ON "public"."personal_finance" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Can update own plaid accounts" ON "public"."plaid_accounts" FOR UPDATE TO "authenticated" USING ("public"."is_own_plaid_account"()) WITH CHECK ("public"."is_own_plaid_account"());

CREATE POLICY "Can update own plaid transactions" ON "public"."plaid_transactions" FOR UPDATE TO "authenticated" USING ("public"."is_own_plaid_transaction"()) WITH CHECK ("public"."is_own_plaid_transaction"());

CREATE POLICY "Can update own user data or admins can update all users data" ON "public"."users" FOR UPDATE TO "authenticated" USING ((("auth"."uid"() = "id") OR "public"."is_admin"("auth"."uid"()))) WITH CHECK (((("auth"."uid"() = "id") AND ("role" = "role")) OR "public"."is_admin"("auth"."uid"())));

CREATE POLICY "Can view own CCF inputs data" ON "public"."creative_cash_flow_inputs" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Can view own CCF or if is admin" ON "public"."creative_cash_flow" FOR SELECT TO "authenticated" USING ((("auth"."uid"() = "user_id") OR "public"."is_admin"("auth"."uid"())));

CREATE POLICY "Can view own CCF results data" ON "public"."creative_cash_flow_results" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Can view own debt snowball data or if is admin" ON "public"."debt_snowball" FOR SELECT TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = "user_id") OR ( SELECT "public"."is_admin"() AS "is_admin")));

CREATE POLICY "Can view own debt snowball data or if is admin" ON "public"."debt_snowballs" FOR SELECT TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = "user_id") OR ( SELECT "public"."is_admin"() AS "is_admin")));

CREATE POLICY "Can view own debt snowball input data or if admin" ON "public"."debt_snowball_inputs" FOR SELECT TO "authenticated" USING ((( SELECT "public"."owns_debt_snowball_inputs"() AS "owns_debt_snowball_inputs") OR ( SELECT "public"."is_admin"() AS "is_admin")));

CREATE POLICY "Can view own debt snowball results or if admin" ON "public"."debt_snowball_results" FOR SELECT TO "authenticated" USING ((( SELECT "public"."owns_debt_snowball_results"() AS "owns_debt_snowball_results") OR ( SELECT "public"."is_admin"() AS "is_admin")));

CREATE POLICY "Can view own debts or is admin" ON "public"."debts" FOR SELECT TO "authenticated" USING ((("auth"."uid"() = "user_id") OR "public"."is_admin"()));

CREATE POLICY "Can view own institutions" ON "public"."plaid" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Can view own personal finances" ON "public"."personal_finance" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Can view own plaid accounts" ON "public"."plaid_accounts" FOR SELECT TO "authenticated" USING ("public"."is_own_plaid_account"());

CREATE POLICY "Can view own plaid transactions" ON "public"."plaid_transactions" FOR SELECT TO "authenticated" USING ("public"."is_own_plaid_transaction"());

CREATE POLICY "Can view their own data and admins can view all user data" ON "public"."users" FOR SELECT TO "authenticated" USING ((("auth"."uid"() = "id") OR "public"."is_admin"("auth"."uid"())));

CREATE POLICY "Users can delete own plaid filters" ON "public"."user_plaid_filters" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Users can insert own plaid filters" ON "public"."user_plaid_filters" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Users can update own plaid filters" ON "public"."user_plaid_filters" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Users can view global plaid filters" ON "public"."global_plaid_filters" FOR SELECT TO "authenticated" USING (( SELECT "public"."is_authenticated"() AS "is_authenticated"));

CREATE POLICY "Users can view own plaid filters" ON "public"."user_plaid_filters" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

ALTER TABLE "public"."creative_cash_flow" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."creative_cash_flow_inputs" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."creative_cash_flow_results" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."debt_snowball" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."debt_snowball_inputs" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."debt_snowball_results" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."debt_snowballs" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."debts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."global_plaid_filters" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."notifiers" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."personal_finance" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."plaid" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."plaid_accounts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."plaid_transactions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_plaid_filters" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."change_user_password"("current_password" "text", "new_password" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."change_user_password"("current_password" "text", "new_password" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."change_user_password"("current_password" "text", "new_password" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."create_creative_cash_flow"("_user_id" "uuid", "_start_date" timestamp with time zone, "_end_date" timestamp with time zone, "_all_other_income" numeric, "_payroll_and_distributions" numeric, "_lifestyle_expenses_tax_rate" numeric, "_tax_account_rate" numeric, "_optimal_savings_strategy" numeric, "_collections" numeric, "_lifestyle_expenses" numeric, "_lifestyle_expenses_tax" numeric, "_business_profit_before_tax" numeric, "_business_overhead" numeric, "_tax_account" numeric, "_waa" numeric, "_total_waa" numeric, "_daily_trend" numeric[], "_weekly_trend" numeric[], "_yearly_trend" numeric[], "_year_to_date" numeric) TO "anon";
GRANT ALL ON FUNCTION "public"."create_creative_cash_flow"("_user_id" "uuid", "_start_date" timestamp with time zone, "_end_date" timestamp with time zone, "_all_other_income" numeric, "_payroll_and_distributions" numeric, "_lifestyle_expenses_tax_rate" numeric, "_tax_account_rate" numeric, "_optimal_savings_strategy" numeric, "_collections" numeric, "_lifestyle_expenses" numeric, "_lifestyle_expenses_tax" numeric, "_business_profit_before_tax" numeric, "_business_overhead" numeric, "_tax_account" numeric, "_waa" numeric, "_total_waa" numeric, "_daily_trend" numeric[], "_weekly_trend" numeric[], "_yearly_trend" numeric[], "_year_to_date" numeric) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_creative_cash_flow"("_user_id" "uuid", "_start_date" timestamp with time zone, "_end_date" timestamp with time zone, "_all_other_income" numeric, "_payroll_and_distributions" numeric, "_lifestyle_expenses_tax_rate" numeric, "_tax_account_rate" numeric, "_optimal_savings_strategy" numeric, "_collections" numeric, "_lifestyle_expenses" numeric, "_lifestyle_expenses_tax" numeric, "_business_profit_before_tax" numeric, "_business_overhead" numeric, "_tax_account" numeric, "_waa" numeric, "_total_waa" numeric, "_daily_trend" numeric[], "_weekly_trend" numeric[], "_yearly_trend" numeric[], "_year_to_date" numeric) TO "service_role";

GRANT ALL ON FUNCTION "public"."create_debt_snowball_record"("user_id" "uuid", "name" "text", "debts" "public"."debt_snowball_debt"[], "inputs" "public"."debt_snowball_inputs_data", "results" "public"."debt_snowball_results_data") TO "anon";
GRANT ALL ON FUNCTION "public"."create_debt_snowball_record"("user_id" "uuid", "name" "text", "debts" "public"."debt_snowball_debt"[], "inputs" "public"."debt_snowball_inputs_data", "results" "public"."debt_snowball_results_data") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_debt_snowball_record"("user_id" "uuid", "name" "text", "debts" "public"."debt_snowball_debt"[], "inputs" "public"."debt_snowball_inputs_data", "results" "public"."debt_snowball_results_data") TO "service_role";

GRANT ALL ON TABLE "public"."global_plaid_filters" TO "anon";
GRANT ALL ON TABLE "public"."global_plaid_filters" TO "authenticated";
GRANT ALL ON TABLE "public"."global_plaid_filters" TO "service_role";

GRANT ALL ON FUNCTION "public"."create_global_plaid_filter"("_filter" "public"."global_plaid_filters", "override" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."create_global_plaid_filter"("_filter" "public"."global_plaid_filters", "override" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_global_plaid_filter"("_filter" "public"."global_plaid_filters", "override" boolean) TO "service_role";

GRANT ALL ON TABLE "public"."user_plaid_filters" TO "anon";
GRANT ALL ON TABLE "public"."user_plaid_filters" TO "authenticated";
GRANT ALL ON TABLE "public"."user_plaid_filters" TO "service_role";

GRANT ALL ON FUNCTION "public"."create_user_plaid_filter"("_filter" "public"."user_plaid_filters", "user_override" boolean, "global_override" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."create_user_plaid_filter"("_filter" "public"."user_plaid_filters", "user_override" boolean, "global_override" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_user_plaid_filter"("_filter" "public"."user_plaid_filters", "user_override" boolean, "global_override" boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_global_plaid_filter"("filter_id" integer, "new_filter_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."delete_global_plaid_filter"("filter_id" integer, "new_filter_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_global_plaid_filter"("filter_id" integer, "new_filter_id" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_user_plaid_filter"("filter_id" integer, "global_filter_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."delete_user_plaid_filter"("filter_id" integer, "global_filter_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_user_plaid_filter"("filter_id" integer, "global_filter_id" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."format_transaction"() TO "anon";
GRANT ALL ON FUNCTION "public"."format_transaction"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."format_transaction"() TO "service_role";

GRANT ALL ON FUNCTION "public"."generate_rates"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_rates"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_rates"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_creative_cash_flow_record"("record_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_creative_cash_flow_record"("record_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_creative_cash_flow_record"("record_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_creative_cash_flow_records"("arg_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_creative_cash_flow_records"("arg_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_creative_cash_flow_records"("arg_user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_debt_snowball_record"("record_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_debt_snowball_record"("record_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_debt_snowball_record"("record_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_debt_snowball_records"("_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_debt_snowball_records"("_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_debt_snowball_records"("_user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_manage_users"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_manage_users"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_manage_users"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_transactions_by_user_id"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_transactions_by_user_id"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_transactions_by_user_id"("user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_transactions_with_account_name"("ins_item_id" "text", "offset_val" integer, "limit_val" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_transactions_with_account_name"("ins_item_id" "text", "offset_val" integer, "limit_val" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_transactions_with_account_name"("ins_item_id" "text", "offset_val" integer, "limit_val" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_init_personal_finance"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_init_personal_finance"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_init_personal_finance"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";

GRANT ALL ON FUNCTION "public"."is_admin"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"("user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."is_authenticated"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_authenticated"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_authenticated"() TO "service_role";

GRANT ALL ON FUNCTION "public"."is_email_used"("email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."is_email_used"("email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_email_used"("email" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."is_own_plaid_account"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_own_plaid_account"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_own_plaid_account"() TO "service_role";

GRANT ALL ON FUNCTION "public"."is_own_plaid_transaction"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_own_plaid_transaction"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_own_plaid_transaction"() TO "service_role";

GRANT ALL ON FUNCTION "public"."owns_debt_snowball_inputs"() TO "anon";
GRANT ALL ON FUNCTION "public"."owns_debt_snowball_inputs"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."owns_debt_snowball_inputs"() TO "service_role";

GRANT ALL ON FUNCTION "public"."owns_debt_snowball_results"() TO "anon";
GRANT ALL ON FUNCTION "public"."owns_debt_snowball_results"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."owns_debt_snowball_results"() TO "service_role";

GRANT ALL ON FUNCTION "public"."recategorize_transactions"() TO "anon";
GRANT ALL ON FUNCTION "public"."recategorize_transactions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."recategorize_transactions"() TO "service_role";

GRANT ALL ON FUNCTION "public"."total_waa_before_date"("user_id" "uuid", "target_date" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."total_waa_before_date"("user_id" "uuid", "target_date" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."total_waa_before_date"("user_id" "uuid", "target_date" timestamp with time zone) TO "service_role";

GRANT ALL ON FUNCTION "public"."update_global_plaid_filter"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_global_plaid_filter"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_global_plaid_filter"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_transaction_categories"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_transaction_categories"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_transaction_categories"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_user_plaid_filter"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_plaid_filter"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_plaid_filter"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_user_profile"("new_name" "text", "new_email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_profile"("new_name" "text", "new_email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_profile"("new_name" "text", "new_email" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."verify_update_debt_snowball"() TO "anon";
GRANT ALL ON FUNCTION "public"."verify_update_debt_snowball"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."verify_update_debt_snowball"() TO "service_role";

GRANT ALL ON FUNCTION "public"."verify_update_plaid"() TO "anon";
GRANT ALL ON FUNCTION "public"."verify_update_plaid"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."verify_update_plaid"() TO "service_role";

GRANT ALL ON TABLE "public"."creative_cash_flow" TO "anon";
GRANT ALL ON TABLE "public"."creative_cash_flow" TO "authenticated";
GRANT ALL ON TABLE "public"."creative_cash_flow" TO "service_role";

GRANT ALL ON TABLE "public"."creative_cash_flow_inputs" TO "anon";
GRANT ALL ON TABLE "public"."creative_cash_flow_inputs" TO "authenticated";
GRANT ALL ON TABLE "public"."creative_cash_flow_inputs" TO "service_role";

GRANT ALL ON TABLE "public"."creative_cash_flow_results" TO "anon";
GRANT ALL ON TABLE "public"."creative_cash_flow_results" TO "authenticated";
GRANT ALL ON TABLE "public"."creative_cash_flow_results" TO "service_role";

GRANT ALL ON TABLE "public"."debt_snowball" TO "anon";
GRANT ALL ON TABLE "public"."debt_snowball" TO "authenticated";
GRANT ALL ON TABLE "public"."debt_snowball" TO "service_role";

GRANT ALL ON TABLE "public"."debt_snowball_inputs" TO "anon";
GRANT ALL ON TABLE "public"."debt_snowball_inputs" TO "authenticated";
GRANT ALL ON TABLE "public"."debt_snowball_inputs" TO "service_role";

GRANT ALL ON TABLE "public"."debt_snowball_results" TO "anon";
GRANT ALL ON TABLE "public"."debt_snowball_results" TO "authenticated";
GRANT ALL ON TABLE "public"."debt_snowball_results" TO "service_role";

GRANT ALL ON TABLE "public"."debt_snowballs" TO "anon";
GRANT ALL ON TABLE "public"."debt_snowballs" TO "authenticated";
GRANT ALL ON TABLE "public"."debt_snowballs" TO "service_role";

GRANT ALL ON TABLE "public"."debts" TO "anon";
GRANT ALL ON TABLE "public"."debts" TO "authenticated";
GRANT ALL ON TABLE "public"."debts" TO "service_role";

GRANT ALL ON SEQUENCE "public"."debts_id_seq1" TO "anon";
GRANT ALL ON SEQUENCE "public"."debts_id_seq1" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."debts_id_seq1" TO "service_role";

GRANT ALL ON SEQUENCE "public"."global_plaid_filters_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."global_plaid_filters_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."global_plaid_filters_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."notifiers" TO "anon";
GRANT ALL ON TABLE "public"."notifiers" TO "authenticated";
GRANT ALL ON TABLE "public"."notifiers" TO "service_role";

GRANT ALL ON SEQUENCE "public"."notifiers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notifiers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notifiers_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."personal_finance" TO "anon";
GRANT ALL ON TABLE "public"."personal_finance" TO "authenticated";
GRANT ALL ON TABLE "public"."personal_finance" TO "service_role";

GRANT ALL ON SEQUENCE "public"."personal_finance_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."personal_finance_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."personal_finance_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."plaid" TO "anon";
GRANT ALL ON TABLE "public"."plaid" TO "authenticated";
GRANT ALL ON TABLE "public"."plaid" TO "service_role";

GRANT ALL ON TABLE "public"."plaid_accounts" TO "anon";
GRANT ALL ON TABLE "public"."plaid_accounts" TO "authenticated";
GRANT ALL ON TABLE "public"."plaid_accounts" TO "service_role";

GRANT ALL ON TABLE "public"."plaid_transactions" TO "anon";
GRANT ALL ON TABLE "public"."plaid_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."plaid_transactions" TO "service_role";

GRANT ALL ON SEQUENCE "public"."user_plaid_filters_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_plaid_filters_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_plaid_filters_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
