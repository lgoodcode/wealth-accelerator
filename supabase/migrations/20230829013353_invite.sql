
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

CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "public";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

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

CREATE OR REPLACE FUNCTION "public"."create_creative_cash_flow"("_user_id" "uuid", "_start_date" timestamp with time zone, "_end_date" timestamp with time zone, "_all_other_income" numeric, "_payroll_and_distributions" numeric, "_lifestyle_expenses_tax_rate" numeric, "_tax_account_rate" numeric, "_optimal_savings_strategy" numeric, "_collections" numeric, "_lifestyle_expenses" numeric, "_lifestyle_expenses_tax" numeric, "_business_profit_before_tax" numeric, "_business_overhead" numeric, "_tax_account" numeric, "_waa" numeric, "_total_waa" numeric, "_weekly_trend" numeric[], "_monthly_trend" numeric[], "_yearly_trend" numeric[], "_year_to_date" numeric) RETURNS "uuid"
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

  INSERT INTO creative_cash_flow_results (id, user_id, collections, lifestyle_expenses, lifestyle_expenses_tax, business_profit_before_tax, business_overhead, tax_account, waa, total_waa, weekly_trend, monthly_trend, yearly_trend, year_to_date)
  VALUES (new_id, _user_id, _collections, _lifestyle_expenses, _lifestyle_expenses_tax, _business_profit_before_tax, _business_overhead, _tax_account, _waa, _total_waa, _weekly_trend, _monthly_trend, _yearly_trend, _year_to_date);

  RETURN new_id;
END;
$$;

ALTER FUNCTION "public"."create_creative_cash_flow"("_user_id" "uuid", "_start_date" timestamp with time zone, "_end_date" timestamp with time zone, "_all_other_income" numeric, "_payroll_and_distributions" numeric, "_lifestyle_expenses_tax_rate" numeric, "_tax_account_rate" numeric, "_optimal_savings_strategy" numeric, "_collections" numeric, "_lifestyle_expenses" numeric, "_lifestyle_expenses_tax" numeric, "_business_profit_before_tax" numeric, "_business_overhead" numeric, "_tax_account" numeric, "_waa" numeric, "_total_waa" numeric, "_weekly_trend" numeric[], "_monthly_trend" numeric[], "_yearly_trend" numeric[], "_year_to_date" numeric) OWNER TO "postgres";

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
            to_jsonb(inputs.*) AS inputs,
            to_jsonb(results.*) AS results
        FROM creative_cash_flow AS cc
        JOIN creative_cash_flow_inputs AS inputs
        ON cc.id = inputs.id
        JOIN creative_cash_flow_results AS results
        ON cc.id = results.id
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
$$;

ALTER FUNCTION "public"."get_creative_cash_flow_records"("arg_user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_transactions_by_user_id"("user_id" "uuid") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
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
    LANGUAGE "plpgsql" SECURITY DEFINER
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

CREATE OR REPLACE FUNCTION "public"."is_own_plaid_account"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  PERFORM
  FROM plaid as p
  WHERE p.item_id = item_id AND p.user_id = auth.uid();
  RETURN FOUND;
END;
$$;

ALTER FUNCTION "public"."is_own_plaid_account"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."is_own_plaid_transaction"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  PERFORM
  FROM plaid as p
  WHERE p.item_id = item_id AND p.user_id = auth.uid();
  RETURN FOUND;
END;
$$;

ALTER FUNCTION "public"."is_own_plaid_transaction"() OWNER TO "postgres";

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
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
DECLARE
  total_waa_sum decimal;
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

SET default_tablespace = '';

SET default_table_access_method = "heap";

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

CREATE TABLE IF NOT EXISTS "public"."creative_cash_flow_notifiers" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "enabled" boolean DEFAULT true NOT NULL
);

ALTER TABLE "public"."creative_cash_flow_notifiers" OWNER TO "postgres";

ALTER TABLE "public"."creative_cash_flow_notifiers" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."creative_cash_flow_notifiers_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

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
    "monthly_trend" numeric(12,2)[] NOT NULL,
    "yearly_trend" numeric(12,2)[] NOT NULL,
    "year_to_date" numeric(12,2) NOT NULL
);

ALTER TABLE "public"."creative_cash_flow_results" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."debts" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "description" "text" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "payment" numeric(10,2) NOT NULL,
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

CREATE TABLE IF NOT EXISTS "public"."plaid_filters" (
    "id" integer NOT NULL,
    "filter" "text" NOT NULL,
    "category" "public"."category" NOT NULL
);

ALTER TABLE "public"."plaid_filters" OWNER TO "postgres";

ALTER TABLE "public"."plaid_filters" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."plaid_filters_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."plaid_transactions" (
    "id" "text" NOT NULL,
    "item_id" "text" NOT NULL,
    "account_id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "category" "public"."category" NOT NULL,
    "date" timestamp with time zone NOT NULL
);

ALTER TABLE "public"."plaid_transactions" OWNER TO "postgres";

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

ALTER TABLE ONLY "public"."creative_cash_flow_notifiers"
    ADD CONSTRAINT "creative_cash_flow_notifiers_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."creative_cash_flow_notifiers"
    ADD CONSTRAINT "creative_cash_flow_notifiers_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."creative_cash_flow"
    ADD CONSTRAINT "creative_cash_flow_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."creative_cash_flow_results"
    ADD CONSTRAINT "creative_cash_flow_results_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."debts"
    ADD CONSTRAINT "debts_pkey1" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."personal_finance"
    ADD CONSTRAINT "personal_finance_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."plaid_accounts"
    ADD CONSTRAINT "plaid_accounts_pkey" PRIMARY KEY ("account_id");

ALTER TABLE ONLY "public"."plaid_filters"
    ADD CONSTRAINT "plaid_filters_filter_key" UNIQUE ("filter");

ALTER TABLE ONLY "public"."plaid_filters"
    ADD CONSTRAINT "plaid_filters_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."plaid"
    ADD CONSTRAINT "plaid_pkey" PRIMARY KEY ("item_id");

ALTER TABLE ONLY "public"."plaid_transactions"
    ADD CONSTRAINT "plaid_transactions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

CREATE INDEX "trgm_idx_plaid_transactions_name" ON "public"."plaid_transactions" USING "gin" ("name" "public"."gin_trgm_ops");

CREATE TRIGGER "on_delete_filter_recategorize_transactions" AFTER DELETE ON "public"."plaid_filters" FOR EACH ROW EXECUTE FUNCTION "public"."recategorize_transactions"();

CREATE TRIGGER "on_insert_plaid_transactions" BEFORE INSERT ON "public"."plaid_transactions" FOR EACH ROW EXECUTE FUNCTION "public"."format_transaction"();

CREATE TRIGGER "on_update_or_insert_filter_update_transaction_categories" AFTER INSERT OR UPDATE ON "public"."plaid_filters" FOR EACH ROW EXECUTE FUNCTION "public"."update_transaction_categories"();

CREATE TRIGGER "on_user_created_init_personal_finance" AFTER INSERT ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_init_personal_finance"();

ALTER TABLE ONLY "public"."creative_cash_flow_inputs"
    ADD CONSTRAINT "creative_cash_flow_inputs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."creative_cash_flow_results"
    ADD CONSTRAINT "creative_cash_flow_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."creative_cash_flow"
    ADD CONSTRAINT "creative_cash_flow_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."debts"
    ADD CONSTRAINT "debts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."personal_finance"
    ADD CONSTRAINT "personal_finance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."plaid_accounts"
    ADD CONSTRAINT "plaid_accounts_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."plaid"("item_id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."plaid_transactions"
    ADD CONSTRAINT "plaid_transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."plaid_accounts"("account_id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."plaid_transactions"
    ADD CONSTRAINT "plaid_transactions_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."plaid"("item_id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."plaid"
    ADD CONSTRAINT "plaid_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

CREATE POLICY "Admin can delete plaid creative_cash_flow_notifiers" ON "public"."creative_cash_flow_notifiers" FOR DELETE TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "Admin can insert plaid creative_cash_flow_notifiers" ON "public"."creative_cash_flow_notifiers" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "Admin can update plaid creative_cash_flow_notifiers data" ON "public"."creative_cash_flow_notifiers" FOR UPDATE TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "Admin can view plaid creative_cash_flow_notifiers data" ON "public"."creative_cash_flow_notifiers" FOR SELECT TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "Admins can delete plaid filters" ON "public"."plaid_filters" FOR DELETE TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "Admins can delete users" ON "public"."users" FOR DELETE TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "Admins can insert plaid filters" ON "public"."plaid_filters" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "Admins can update plaid filters data" ON "public"."plaid_filters" FOR UPDATE TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "Admins can view plaid filters data" ON "public"."plaid_filters" FOR SELECT TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "Can delete own CCF data" ON "public"."creative_cash_flow" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Can delete own CCF inputs" ON "public"."creative_cash_flow_inputs" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Can delete own CCF results" ON "public"."creative_cash_flow_results" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Can delete own debts" ON "public"."debts" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Can delete own institutions" ON "public"."plaid" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Can delete own plaid accounts" ON "public"."plaid_accounts" FOR DELETE TO "authenticated" USING ("public"."is_own_plaid_account"());

CREATE POLICY "Can delete own plaid transactions" ON "public"."plaid_transactions" FOR DELETE TO "authenticated" USING ("public"."is_own_plaid_transaction"());

CREATE POLICY "Can insert new CCF data" ON "public"."creative_cash_flow" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Can insert new CCF inputs" ON "public"."creative_cash_flow_inputs" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Can insert new CCF results" ON "public"."creative_cash_flow_results" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Can insert new debts" ON "public"."debts" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Can insert new institutions" ON "public"."plaid" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Can insert own plaid accounts" ON "public"."plaid_accounts" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_own_plaid_account"());

CREATE POLICY "Can insert own plaid transactions" ON "public"."plaid_transactions" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_own_plaid_transaction"());

CREATE POLICY "Can update own CCF data" ON "public"."creative_cash_flow" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Can update own debt data" ON "public"."debts" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Can update own institution data" ON "public"."plaid" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Can update own personal_finance data" ON "public"."personal_finance" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Can update own plaid accounts data" ON "public"."plaid_accounts" FOR UPDATE TO "authenticated" USING ("public"."is_own_plaid_account"());

CREATE POLICY "Can update own plaid transactions data" ON "public"."plaid_transactions" FOR UPDATE TO "authenticated" USING ("public"."is_own_plaid_transaction"());

CREATE POLICY "Can update own user data or admins can update all users data" ON "public"."users" FOR UPDATE TO "authenticated" USING ((("auth"."uid"() = "id") OR "public"."is_admin"("auth"."uid"()))) WITH CHECK (((("auth"."uid"() = "id") AND ("role" = "role")) OR "public"."is_admin"("auth"."uid"())));

CREATE POLICY "Can view own CCF inputs data" ON "public"."creative_cash_flow_inputs" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Can view own CCF or if is admin" ON "public"."creative_cash_flow" FOR SELECT TO "authenticated" USING ((("auth"."uid"() = "user_id") OR "public"."is_admin"("auth"."uid"())));

CREATE POLICY "Can view own CCF results data" ON "public"."creative_cash_flow_results" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Can view own debt data or admins can view all debt data" ON "public"."debts" FOR SELECT TO "authenticated" USING ((("auth"."uid"() = "user_id") OR "public"."is_admin"("auth"."uid"())));

CREATE POLICY "Can view own institution data" ON "public"."plaid" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Can view own personal_finance data" ON "public"."personal_finance" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Can view own plaid accounts data" ON "public"."plaid_accounts" FOR SELECT TO "authenticated" USING ("public"."is_own_plaid_account"());

CREATE POLICY "Can view own plaid transactions data" ON "public"."plaid_transactions" FOR SELECT TO "authenticated" USING ("public"."is_own_plaid_transaction"());

CREATE POLICY "Can view their own data and admins can view all user data" ON "public"."users" FOR SELECT TO "authenticated" USING ((("auth"."uid"() = "id") OR "public"."is_admin"("auth"."uid"())));

ALTER TABLE "public"."creative_cash_flow" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."creative_cash_flow_inputs" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."creative_cash_flow_notifiers" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."creative_cash_flow_results" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."debts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."personal_finance" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."plaid" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."plaid_accounts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."plaid_filters" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."plaid_transactions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "service_role";

GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "service_role";

GRANT ALL ON FUNCTION "public"."change_user_password"("current_password" "text", "new_password" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."change_user_password"("current_password" "text", "new_password" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."change_user_password"("current_password" "text", "new_password" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."create_creative_cash_flow"("_user_id" "uuid", "_start_date" timestamp with time zone, "_end_date" timestamp with time zone, "_all_other_income" numeric, "_payroll_and_distributions" numeric, "_lifestyle_expenses_tax_rate" numeric, "_tax_account_rate" numeric, "_optimal_savings_strategy" numeric, "_collections" numeric, "_lifestyle_expenses" numeric, "_lifestyle_expenses_tax" numeric, "_business_profit_before_tax" numeric, "_business_overhead" numeric, "_tax_account" numeric, "_waa" numeric, "_total_waa" numeric, "_weekly_trend" numeric[], "_monthly_trend" numeric[], "_yearly_trend" numeric[], "_year_to_date" numeric) TO "anon";
GRANT ALL ON FUNCTION "public"."create_creative_cash_flow"("_user_id" "uuid", "_start_date" timestamp with time zone, "_end_date" timestamp with time zone, "_all_other_income" numeric, "_payroll_and_distributions" numeric, "_lifestyle_expenses_tax_rate" numeric, "_tax_account_rate" numeric, "_optimal_savings_strategy" numeric, "_collections" numeric, "_lifestyle_expenses" numeric, "_lifestyle_expenses_tax" numeric, "_business_profit_before_tax" numeric, "_business_overhead" numeric, "_tax_account" numeric, "_waa" numeric, "_total_waa" numeric, "_weekly_trend" numeric[], "_monthly_trend" numeric[], "_yearly_trend" numeric[], "_year_to_date" numeric) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_creative_cash_flow"("_user_id" "uuid", "_start_date" timestamp with time zone, "_end_date" timestamp with time zone, "_all_other_income" numeric, "_payroll_and_distributions" numeric, "_lifestyle_expenses_tax_rate" numeric, "_tax_account_rate" numeric, "_optimal_savings_strategy" numeric, "_collections" numeric, "_lifestyle_expenses" numeric, "_lifestyle_expenses_tax" numeric, "_business_profit_before_tax" numeric, "_business_overhead" numeric, "_tax_account" numeric, "_waa" numeric, "_total_waa" numeric, "_weekly_trend" numeric[], "_monthly_trend" numeric[], "_yearly_trend" numeric[], "_year_to_date" numeric) TO "service_role";

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

GRANT ALL ON FUNCTION "public"."get_transactions_by_user_id"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_transactions_by_user_id"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_transactions_by_user_id"("user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_transactions_with_account_name"("ins_item_id" "text", "offset_val" integer, "limit_val" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_transactions_with_account_name"("ins_item_id" "text", "offset_val" integer, "limit_val" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_transactions_with_account_name"("ins_item_id" "text", "offset_val" integer, "limit_val" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_init_personal_finance"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_init_personal_finance"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_init_personal_finance"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."is_admin"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"("user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."is_own_plaid_account"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_own_plaid_account"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_own_plaid_account"() TO "service_role";

GRANT ALL ON FUNCTION "public"."is_own_plaid_transaction"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_own_plaid_transaction"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_own_plaid_transaction"() TO "service_role";

GRANT ALL ON FUNCTION "public"."recategorize_transactions"() TO "anon";
GRANT ALL ON FUNCTION "public"."recategorize_transactions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."recategorize_transactions"() TO "service_role";

GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "postgres";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "anon";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "service_role";

GRANT ALL ON FUNCTION "public"."show_limit"() TO "postgres";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "anon";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "service_role";

GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "service_role";

GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."total_waa_before_date"("user_id" "uuid", "target_date" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."total_waa_before_date"("user_id" "uuid", "target_date" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."total_waa_before_date"("user_id" "uuid", "target_date" timestamp with time zone) TO "service_role";

GRANT ALL ON FUNCTION "public"."update_transaction_categories"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_transaction_categories"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_transaction_categories"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_user_profile"("new_name" "text", "new_email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_profile"("new_name" "text", "new_email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_profile"("new_name" "text", "new_email" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "service_role";

GRANT ALL ON TABLE "public"."creative_cash_flow" TO "anon";
GRANT ALL ON TABLE "public"."creative_cash_flow" TO "authenticated";
GRANT ALL ON TABLE "public"."creative_cash_flow" TO "service_role";

GRANT ALL ON TABLE "public"."creative_cash_flow_inputs" TO "anon";
GRANT ALL ON TABLE "public"."creative_cash_flow_inputs" TO "authenticated";
GRANT ALL ON TABLE "public"."creative_cash_flow_inputs" TO "service_role";

GRANT ALL ON TABLE "public"."creative_cash_flow_notifiers" TO "anon";
GRANT ALL ON TABLE "public"."creative_cash_flow_notifiers" TO "authenticated";
GRANT ALL ON TABLE "public"."creative_cash_flow_notifiers" TO "service_role";

GRANT ALL ON SEQUENCE "public"."creative_cash_flow_notifiers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."creative_cash_flow_notifiers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."creative_cash_flow_notifiers_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."creative_cash_flow_results" TO "anon";
GRANT ALL ON TABLE "public"."creative_cash_flow_results" TO "authenticated";
GRANT ALL ON TABLE "public"."creative_cash_flow_results" TO "service_role";

GRANT ALL ON TABLE "public"."debts" TO "anon";
GRANT ALL ON TABLE "public"."debts" TO "authenticated";
GRANT ALL ON TABLE "public"."debts" TO "service_role";

GRANT ALL ON SEQUENCE "public"."debts_id_seq1" TO "anon";
GRANT ALL ON SEQUENCE "public"."debts_id_seq1" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."debts_id_seq1" TO "service_role";

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

GRANT ALL ON TABLE "public"."plaid_filters" TO "anon";
GRANT ALL ON TABLE "public"."plaid_filters" TO "authenticated";
GRANT ALL ON TABLE "public"."plaid_filters" TO "service_role";

GRANT ALL ON SEQUENCE "public"."plaid_filters_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."plaid_filters_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."plaid_filters_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."plaid_transactions" TO "anon";
GRANT ALL ON TABLE "public"."plaid_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."plaid_transactions" TO "service_role";

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
