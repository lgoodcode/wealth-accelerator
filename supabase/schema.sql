--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)

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

--
-- Name: pgsodium; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";


--
-- Name: pgtle; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA "pgtle";


ALTER SCHEMA "pgtle" OWNER TO "supabase_admin";

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";


--
-- Name: category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."category" AS ENUM (
    'Transfer',
    'Money-In',
    'Money-Out'
);


ALTER TYPE "public"."category" OWNER TO "postgres";

--
-- Name: delete_user("uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."delete_user"("user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  DELETE FROM clients WHERE id = user_id;
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;


ALTER FUNCTION "public"."delete_user"("user_id" "uuid") OWNER TO "postgres";

--
-- Name: get_plaid_accounts("uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_plaid_accounts"("user_id" "uuid") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN (
    SELECT json_agg(json_build_object(
      'account_id', pa.account_id,
      'item_id', pa.item_id,
      'name', pa.name,
      'type', pa.type
    )) AS accounts
    FROM plaid_accounts pa
    INNER JOIN plaid p ON pa.item_id = p.item_id
    WHERE p.client_id = user_id
  );
END;
$$;


ALTER FUNCTION "public"."get_plaid_accounts"("user_id" "uuid") OWNER TO "postgres";

--
-- Name: get_transactions_by_account_ids("text"[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_transactions_by_account_ids"("account_ids" "text"[]) RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
  WHERE
    pa.type = 'personal' AND
    pa.account_id = ANY(account_ids) AND
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
  WHERE
    pa.type = 'business' AND
    pa.account_id = ANY(account_ids) AND
    pa.enabled = true;

  RETURN json_build_object(
    'personal', personal_transactions,
    'business', business_transactions
  );
END;
$$;


ALTER FUNCTION "public"."get_transactions_by_account_ids"("account_ids" "text"[]) OWNER TO "postgres";

--
-- Name: get_user_display("uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_user_display"("user_id" "uuid") RETURNS TABLE("id" "uuid", "name" "text", "email" "text", "role" "text", "policies" smallint, "total_debt" double precision)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    C.id,
    C.name,
    C.email,
    C.role,
    COUNT(DISTINCT I.policy_id)::SMALLINT,
    COALESCE(SUM(DISTINCT D.amount_owed), 0)::FLOAT
  FROM clients AS C
  LEFT JOIN insurance_policy AS I ON I.client_id = user_id
  LEFT JOIN debts AS D ON D.client_id = user_id
  WHERE C.id = user_id
  GROUP BY C.id, C.name, C.role;
END;
$$;


ALTER FUNCTION "public"."get_user_display"("user_id" "uuid") OWNER TO "postgres";

--
-- Name: get_user_last_policy_id("uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_user_last_policy_id"("user_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN (
    SELECT COALESCE(MAX(DISTINCT policy_id), -1)
    FROM insurance_policy
    WHERE client_id = user_id
  );
END;
$$;


ALTER FUNCTION "public"."get_user_last_policy_id"("user_id" "uuid") OWNER TO "postgres";

--
-- Name: get_users_display(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_users_display"() RETURNS TABLE("id" "uuid", "name" "text", "email" "text", "role" "text", "policies" smallint, "total_debt" double precision)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    C.id,
    C.name,
    C.email,
    C.role,
    COUNT(DISTINCT I.policy_id)::SMALLINT,
    COALESCE(SUM(DISTINCT D.amount_owed), 0)::FLOAT
  FROM clients AS C
  LEFT JOIN insurance_policy AS I ON C.id = I.client_id
  LEFT JOIN debts AS D ON C.id = D.client_id
  GROUP BY C.id, C.name, C.role;
END;
$$;


ALTER FUNCTION "public"."get_users_display"() OWNER TO "postgres";

--
-- Name: handle_new_client_index_fund_rates(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."handle_new_client_index_fund_rates"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  FOR i in 1..60 LOOP
    INSERT INTO public.index_fund_rates (client_id, year)
    VALUES (NEW.id, i);
  END LOOP;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_client_index_fund_rates"() OWNER TO "postgres";

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.clients (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'role'
  );
  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

--
-- Name: update_transaction_categories(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."update_transaction_categories"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE plaid_transactions
  SET category = NEW.category
  WHERE name ILIKE '%' || NEW.filter || '%';
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_transaction_categories"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."clients" (
    "id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'user'::"text" NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "start_date" timestamp without time zone DEFAULT (CURRENT_DATE AT TIME ZONE 'PST'::"text") NOT NULL,
    "stop_invest" smallint DEFAULT 10 NOT NULL,
    "start_withdraw" smallint DEFAULT 20 NOT NULL,
    "money_needed_to_live" numeric(10,2) DEFAULT 100000 NOT NULL,
    "tax_bracket" numeric(2,2) DEFAULT 0.35 NOT NULL,
    "tax_bracket_future" numeric(2,2) DEFAULT 0.4 NOT NULL,
    "premium_deposit" numeric(10,2) DEFAULT 50000 NOT NULL
);


ALTER TABLE "public"."clients" OWNER TO "postgres";

--
-- Name: creative_cash_flow_inputs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."creative_cash_flow_inputs" (
    "id" integer NOT NULL,
    "client_id" "uuid" NOT NULL,
    "created" timestamp without time zone NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date" NOT NULL,
    "all_other_income" integer NOT NULL,
    "payroll_and_distributions" numeric(10,2) NOT NULL,
    "lifestyle_expenses_tax_rate" numeric(2,2) NOT NULL,
    "tax_account_rate" numeric(2,2) NOT NULL,
    "optimal_savings_strategies" integer NOT NULL
);


ALTER TABLE "public"."creative_cash_flow_inputs" OWNER TO "postgres";

--
-- Name: creative_cash_flow_inputs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."creative_cash_flow_inputs" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."creative_cash_flow_inputs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: creative_cash_flow_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."creative_cash_flow_results" (
    "id" integer NOT NULL,
    "client_id" "uuid" NOT NULL,
    "collections" numeric(10,2) NOT NULL,
    "lifestyle_expenses" numeric(10,2) NOT NULL,
    "lifestyle_expenses_tax" numeric(10,2) NOT NULL,
    "business_checking_account_before_tax" numeric(10,2) NOT NULL,
    "business_overhead" numeric(10,2) NOT NULL,
    "tax_account" numeric(10,2) NOT NULL,
    "waa_after_tax" numeric(10,2) NOT NULL,
    "weekly_trend" numeric(10,2)[] NOT NULL,
    "monthly_trend" numeric(10,2)[] NOT NULL,
    "yearly_trend" numeric(10,2)[] NOT NULL,
    "year_to_date" numeric(10,2) NOT NULL
);


ALTER TABLE "public"."creative_cash_flow_results" OWNER TO "postgres";

--
-- Name: creative_cash_flow_results_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."creative_cash_flow_results" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."creative_cash_flow_results_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: debts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."debts" (
    "id" integer NOT NULL,
    "client_id" "uuid" NOT NULL,
    "description" "text" NOT NULL,
    "amount_owed" numeric(10,2) NOT NULL,
    "payment" numeric(7,2) NOT NULL,
    "interest_rate" numeric(4,4) NOT NULL,
    "months_remaining" smallint NOT NULL
);


ALTER TABLE "public"."debts" OWNER TO "postgres";

--
-- Name: debts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."debts" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."debts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: index_fund_rates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."index_fund_rates" (
    "id" integer NOT NULL,
    "client_id" "uuid" NOT NULL,
    "year" smallint NOT NULL,
    "rate" numeric(4,4) DEFAULT 0.07 NOT NULL
);


ALTER TABLE "public"."index_fund_rates" OWNER TO "postgres";

--
-- Name: index_fund_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."index_fund_rates" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."index_fund_rates_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: insurance_companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."insurance_companies" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."insurance_companies" OWNER TO "postgres";

--
-- Name: insurance_companies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."insurance_companies" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."insurance_companies_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: insurance_policy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."insurance_policy" (
    "id" integer NOT NULL,
    "client_id" "uuid" NOT NULL,
    "policy_id" integer NOT NULL,
    "name" "text" NOT NULL,
    "company" "text" NOT NULL,
    "year" smallint NOT NULL,
    "premium" numeric(10,2) DEFAULT 0 NOT NULL,
    "loan_interest_rate" numeric(4,4) DEFAULT 0.045 NOT NULL,
    "age_end_year" smallint NOT NULL,
    "net_cash_value_end_year" numeric(10,2) NOT NULL,
    "net_death_benefit_end_year" numeric(10,2) NOT NULL,
    "annual_net_outlay" numeric(10,2) DEFAULT 0 NOT NULL,
    "cumulative_net_outlay" numeric(10,2) DEFAULT 0 NOT NULL,
    "net_annual_cash_value_increase" numeric(10,2) DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."insurance_policy" OWNER TO "postgres";

--
-- Name: insurance_policy_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."insurance_policy" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."insurance_policy_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: plaid; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."plaid" (
    "item_id" "text" NOT NULL,
    "client_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "access_token" "text" NOT NULL,
    "expiration" timestamp without time zone NOT NULL,
    "cursor" "text",
    "last_synced" timestamp without time zone
);


ALTER TABLE "public"."plaid" OWNER TO "postgres";

--
-- Name: plaid_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."plaid_accounts" (
    "account_id" "text" NOT NULL,
    "item_id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "enabled" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."plaid_accounts" OWNER TO "postgres";

--
-- Name: plaid_filters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."plaid_filters" (
    "id" integer NOT NULL,
    "filter" "text" NOT NULL,
    "category" "public"."category" NOT NULL
);


ALTER TABLE "public"."plaid_filters" OWNER TO "postgres";

--
-- Name: plaid_filters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."plaid_filters" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."plaid_filters_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: plaid_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."plaid_transactions" (
    "id" "text" NOT NULL,
    "item_id" "text" NOT NULL,
    "account_id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "category" "public"."category" NOT NULL,
    "date" "date" NOT NULL
);


ALTER TABLE "public"."plaid_transactions" OWNER TO "postgres";

--
-- Name: clients clients_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_email_key" UNIQUE ("email");


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_pkey" PRIMARY KEY ("id");


--
-- Name: creative_cash_flow_inputs creative_cash_flow_inputs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."creative_cash_flow_inputs"
    ADD CONSTRAINT "creative_cash_flow_inputs_pkey" PRIMARY KEY ("id");


--
-- Name: creative_cash_flow_results creative_cash_flow_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."creative_cash_flow_results"
    ADD CONSTRAINT "creative_cash_flow_results_pkey" PRIMARY KEY ("id");


--
-- Name: debts debts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."debts"
    ADD CONSTRAINT "debts_pkey" PRIMARY KEY ("id");


--
-- Name: index_fund_rates index_fund_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."index_fund_rates"
    ADD CONSTRAINT "index_fund_rates_pkey" PRIMARY KEY ("id");


--
-- Name: insurance_companies insurance_companies_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."insurance_companies"
    ADD CONSTRAINT "insurance_companies_name_key" UNIQUE ("name");


--
-- Name: insurance_companies insurance_companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."insurance_companies"
    ADD CONSTRAINT "insurance_companies_pkey" PRIMARY KEY ("id");


--
-- Name: insurance_policy insurance_policy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."insurance_policy"
    ADD CONSTRAINT "insurance_policy_pkey" PRIMARY KEY ("id");


--
-- Name: plaid_accounts plaid_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."plaid_accounts"
    ADD CONSTRAINT "plaid_accounts_pkey" PRIMARY KEY ("account_id");


--
-- Name: plaid_filters plaid_filters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."plaid_filters"
    ADD CONSTRAINT "plaid_filters_pkey" PRIMARY KEY ("id");


--
-- Name: plaid plaid_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."plaid"
    ADD CONSTRAINT "plaid_pkey" PRIMARY KEY ("item_id");


--
-- Name: plaid_transactions plaid_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."plaid_transactions"
    ADD CONSTRAINT "plaid_transactions_pkey" PRIMARY KEY ("id");


--
-- Name: clients on_client_created_create_default_index_fund_rates_records; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "on_client_created_create_default_index_fund_rates_records" AFTER INSERT ON "public"."clients" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_client_index_fund_rates"();


--
-- Name: plaid_filters on_update_or_insert_filter_update_transaction_categories; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "on_update_or_insert_filter_update_transaction_categories" AFTER INSERT OR UPDATE ON "public"."plaid_filters" FOR EACH ROW EXECUTE FUNCTION "public"."update_transaction_categories"();


--
-- Name: creative_cash_flow_inputs creative_cash_flow_inputs_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."creative_cash_flow_inputs"
    ADD CONSTRAINT "creative_cash_flow_inputs_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE CASCADE;


--
-- Name: creative_cash_flow_results creative_cash_flow_results_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."creative_cash_flow_results"
    ADD CONSTRAINT "creative_cash_flow_results_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE CASCADE;


--
-- Name: debts debts_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."debts"
    ADD CONSTRAINT "debts_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE CASCADE;


--
-- Name: index_fund_rates index_fund_rates_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."index_fund_rates"
    ADD CONSTRAINT "index_fund_rates_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE CASCADE;


--
-- Name: insurance_policy insurance_policy_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."insurance_policy"
    ADD CONSTRAINT "insurance_policy_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE CASCADE;


--
-- Name: insurance_policy insurance_policy_company_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."insurance_policy"
    ADD CONSTRAINT "insurance_policy_company_fkey" FOREIGN KEY ("company") REFERENCES "public"."insurance_companies"("name");


--
-- Name: plaid_accounts plaid_accounts_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."plaid_accounts"
    ADD CONSTRAINT "plaid_accounts_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."plaid"("item_id") ON DELETE CASCADE;


--
-- Name: plaid plaid_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."plaid"
    ADD CONSTRAINT "plaid_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE CASCADE;


--
-- Name: plaid_transactions plaid_transactions_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."plaid_transactions"
    ADD CONSTRAINT "plaid_transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."plaid_accounts"("account_id") ON DELETE CASCADE;


--
-- Name: plaid_transactions plaid_transactions_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."plaid_transactions"
    ADD CONSTRAINT "plaid_transactions_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."plaid"("item_id") ON DELETE CASCADE;


--
-- Name: clients Can update own user data.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Can update own user data." ON "public"."clients" FOR UPDATE USING (("auth"."uid"() = "id"));


--
-- Name: clients Can view own user data.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Can view own user data." ON "public"."clients" FOR SELECT USING (("auth"."uid"() = "id"));


--
-- Name: creative_cash_flow_inputs No access.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "No access." ON "public"."creative_cash_flow_inputs" FOR SELECT USING (false);


--
-- Name: creative_cash_flow_results No access.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "No access." ON "public"."creative_cash_flow_results" FOR SELECT USING (false);


--
-- Name: debts No access.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "No access." ON "public"."debts" FOR SELECT USING (false);


--
-- Name: index_fund_rates No access.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "No access." ON "public"."index_fund_rates" FOR SELECT USING (false);


--
-- Name: insurance_companies No access.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "No access." ON "public"."insurance_companies" FOR SELECT USING (false);


--
-- Name: insurance_policy No access.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "No access." ON "public"."insurance_policy" FOR SELECT USING (false);


--
-- Name: plaid No access.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "No access." ON "public"."plaid" FOR SELECT USING (false);


--
-- Name: plaid_accounts No access.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "No access." ON "public"."plaid_accounts" FOR SELECT USING (false);


--
-- Name: plaid_filters No access.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "No access." ON "public"."plaid_filters" FOR SELECT USING (false);


--
-- Name: plaid_transactions No access.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "No access." ON "public"."plaid_transactions" FOR SELECT USING (false);


--
-- Name: clients; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."clients" ENABLE ROW LEVEL SECURITY;

--
-- Name: creative_cash_flow_inputs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."creative_cash_flow_inputs" ENABLE ROW LEVEL SECURITY;

--
-- Name: creative_cash_flow_results; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."creative_cash_flow_results" ENABLE ROW LEVEL SECURITY;

--
-- Name: debts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."debts" ENABLE ROW LEVEL SECURITY;

--
-- Name: index_fund_rates; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."index_fund_rates" ENABLE ROW LEVEL SECURITY;

--
-- Name: insurance_companies; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."insurance_companies" ENABLE ROW LEVEL SECURITY;

--
-- Name: insurance_policy; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."insurance_policy" ENABLE ROW LEVEL SECURITY;

--
-- Name: plaid; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."plaid" ENABLE ROW LEVEL SECURITY;

--
-- Name: plaid_accounts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."plaid_accounts" ENABLE ROW LEVEL SECURITY;

--
-- Name: plaid_filters; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."plaid_filters" ENABLE ROW LEVEL SECURITY;

--
-- Name: plaid_transactions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."plaid_transactions" ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA "public"; Type: ACL; Schema: -; Owner: pg_database_owner
--

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


--
-- Name: FUNCTION "algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "armor"("bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."armor"("bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."armor"("bytea") TO "dashboard_user";


--
-- Name: FUNCTION "armor"("bytea", "text"[], "text"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) TO "dashboard_user";


--
-- Name: FUNCTION "crypt"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."crypt"("text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."crypt"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "dearmor"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."dearmor"("text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."dearmor"("text") TO "dashboard_user";


--
-- Name: FUNCTION "decrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "decrypt_iv"("bytea", "bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "digest"("bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."digest"("bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."digest"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "digest"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."digest"("text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."digest"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "encrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "encrypt_iv"("bytea", "bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "gen_random_bytes"(integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) TO "dashboard_user";


--
-- Name: FUNCTION "gen_random_uuid"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."gen_random_uuid"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."gen_random_uuid"() TO "dashboard_user";


--
-- Name: FUNCTION "gen_salt"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."gen_salt"("text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."gen_salt"("text") TO "dashboard_user";


--
-- Name: FUNCTION "gen_salt"("text", integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."gen_salt"("text", integer) TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."gen_salt"("text", integer) TO "dashboard_user";


--
-- Name: FUNCTION "hmac"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "hmac"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision) TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision) TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint) TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint) TO "dashboard_user";


--
-- Name: FUNCTION "pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_key_id"("bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt"("text", "bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt"("text", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt_bytea"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt_bytea"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt"("bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt_bytea"("bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt_bytea"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt_bytea"("bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt_bytea"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "sign"("payload" "json", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."sign"("payload" "json", "secret" "text", "algorithm" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."sign"("payload" "json", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "try_cast_double"("inp" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."try_cast_double"("inp" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."try_cast_double"("inp" "text") TO "dashboard_user";


--
-- Name: FUNCTION "url_decode"("data" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."url_decode"("data" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."url_decode"("data" "text") TO "dashboard_user";


--
-- Name: FUNCTION "url_encode"("data" "bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."url_encode"("data" "bytea") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."url_encode"("data" "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v1"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v1mc"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v3"("namespace" "uuid", "name" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v4"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v4"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v4"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v5"("namespace" "uuid", "name" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_nil"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."uuid_nil"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_nil"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_dns"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_dns"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_dns"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_oid"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_oid"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_oid"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_url"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_url"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_url"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_x500"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_x500"() TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."uuid_ns_x500"() TO "dashboard_user";


--
-- Name: FUNCTION "verify"("token" "text", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "extensions"."verify"("token" "text", "secret" "text", "algorithm" "text") TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON FUNCTION "extensions"."verify"("token" "text", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "comment_directive"("comment_" "text"); Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "postgres";
-- GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "anon";
-- GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "service_role";


--
-- Name: FUNCTION "exception"("message" "text"); Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "postgres";
-- GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "anon";
-- GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "service_role";


--
-- Name: FUNCTION "get_schema_version"(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "postgres";
-- GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "anon";
-- GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "service_role";


--
-- Name: FUNCTION "increment_schema_version"(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "postgres";
-- GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "anon";
-- GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "service_role";


--
-- Name: FUNCTION "graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb"); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "postgres";
-- GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "anon";
-- GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "service_role";


--
-- Name: FUNCTION "crypto_aead_det_decrypt"("message" "bytea", "additional" "bytea", "key_uuid" "uuid", "nonce" "bytea"); Type: ACL; Schema: pgsodium; Owner: pgsodium_keymaker
--

-- GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_decrypt"("message" "bytea", "additional" "bytea", "key_uuid" "uuid", "nonce" "bytea") TO "service_role";


--
-- Name: FUNCTION "crypto_aead_det_encrypt"("message" "bytea", "additional" "bytea", "key_uuid" "uuid", "nonce" "bytea"); Type: ACL; Schema: pgsodium; Owner: pgsodium_keymaker
--

-- GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_encrypt"("message" "bytea", "additional" "bytea", "key_uuid" "uuid", "nonce" "bytea") TO "service_role";


--
-- Name: FUNCTION "crypto_aead_det_keygen"(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_keygen"() TO "service_role";


--
-- Name: FUNCTION "delete_user"("user_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."delete_user"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."delete_user"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_user"("user_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "get_plaid_accounts"("user_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_plaid_accounts"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_plaid_accounts"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_plaid_accounts"("user_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "get_transactions_by_account_ids"("account_ids" "text"[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_transactions_by_account_ids"("account_ids" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."get_transactions_by_account_ids"("account_ids" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_transactions_by_account_ids"("account_ids" "text"[]) TO "service_role";


--
-- Name: FUNCTION "get_user_display"("user_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_user_display"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_display"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_display"("user_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "get_user_last_policy_id"("user_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_user_last_policy_id"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_last_policy_id"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_last_policy_id"("user_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "get_users_display"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_users_display"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_users_display"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_users_display"() TO "service_role";


--
-- Name: FUNCTION "handle_new_client_index_fund_rates"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."handle_new_client_index_fund_rates"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_client_index_fund_rates"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_client_index_fund_rates"() TO "service_role";


--
-- Name: FUNCTION "handle_new_user"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


--
-- Name: FUNCTION "update_transaction_categories"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."update_transaction_categories"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_transaction_categories"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_transaction_categories"() TO "service_role";


--
-- Name: TABLE "pg_stat_statements"; Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON TABLE "extensions"."pg_stat_statements" TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON TABLE "extensions"."pg_stat_statements" TO "dashboard_user";


--
-- Name: TABLE "pg_stat_statements_info"; Type: ACL; Schema: extensions; Owner: supabase_admin
--

-- GRANT ALL ON TABLE "extensions"."pg_stat_statements_info" TO "postgres" WITH GRANT OPTION;
-- GRANT ALL ON TABLE "extensions"."pg_stat_statements_info" TO "dashboard_user";


--
-- Name: SEQUENCE "seq_schema_version"; Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "postgres";
-- GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "anon";
-- GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "authenticated";
-- GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "service_role";


--
-- Name: TABLE "decrypted_key"; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

-- GRANT ALL ON TABLE "pgsodium"."decrypted_key" TO "pgsodium_keyholder";


--
-- Name: TABLE "masking_rule"; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

-- GRANT ALL ON TABLE "pgsodium"."masking_rule" TO "pgsodium_keyholder";


--
-- Name: TABLE "mask_columns"; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

-- GRANT ALL ON TABLE "pgsodium"."mask_columns" TO "pgsodium_keyholder";


--
-- Name: TABLE "clients"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."clients" TO "anon";
GRANT ALL ON TABLE "public"."clients" TO "authenticated";
GRANT ALL ON TABLE "public"."clients" TO "service_role";


--
-- Name: TABLE "creative_cash_flow_inputs"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."creative_cash_flow_inputs" TO "anon";
GRANT ALL ON TABLE "public"."creative_cash_flow_inputs" TO "authenticated";
GRANT ALL ON TABLE "public"."creative_cash_flow_inputs" TO "service_role";


--
-- Name: SEQUENCE "creative_cash_flow_inputs_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."creative_cash_flow_inputs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."creative_cash_flow_inputs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."creative_cash_flow_inputs_id_seq" TO "service_role";


--
-- Name: TABLE "creative_cash_flow_results"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."creative_cash_flow_results" TO "anon";
GRANT ALL ON TABLE "public"."creative_cash_flow_results" TO "authenticated";
GRANT ALL ON TABLE "public"."creative_cash_flow_results" TO "service_role";


--
-- Name: SEQUENCE "creative_cash_flow_results_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."creative_cash_flow_results_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."creative_cash_flow_results_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."creative_cash_flow_results_id_seq" TO "service_role";


--
-- Name: TABLE "debts"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."debts" TO "anon";
GRANT ALL ON TABLE "public"."debts" TO "authenticated";
GRANT ALL ON TABLE "public"."debts" TO "service_role";


--
-- Name: SEQUENCE "debts_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."debts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."debts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."debts_id_seq" TO "service_role";


--
-- Name: TABLE "index_fund_rates"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."index_fund_rates" TO "anon";
GRANT ALL ON TABLE "public"."index_fund_rates" TO "authenticated";
GRANT ALL ON TABLE "public"."index_fund_rates" TO "service_role";


--
-- Name: SEQUENCE "index_fund_rates_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."index_fund_rates_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."index_fund_rates_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."index_fund_rates_id_seq" TO "service_role";


--
-- Name: TABLE "insurance_companies"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."insurance_companies" TO "anon";
GRANT ALL ON TABLE "public"."insurance_companies" TO "authenticated";
GRANT ALL ON TABLE "public"."insurance_companies" TO "service_role";


--
-- Name: SEQUENCE "insurance_companies_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."insurance_companies_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."insurance_companies_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."insurance_companies_id_seq" TO "service_role";


--
-- Name: TABLE "insurance_policy"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."insurance_policy" TO "anon";
GRANT ALL ON TABLE "public"."insurance_policy" TO "authenticated";
GRANT ALL ON TABLE "public"."insurance_policy" TO "service_role";


--
-- Name: SEQUENCE "insurance_policy_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."insurance_policy_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."insurance_policy_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."insurance_policy_id_seq" TO "service_role";


--
-- Name: TABLE "plaid"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."plaid" TO "anon";
GRANT ALL ON TABLE "public"."plaid" TO "authenticated";
GRANT ALL ON TABLE "public"."plaid" TO "service_role";


--
-- Name: TABLE "plaid_accounts"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."plaid_accounts" TO "anon";
GRANT ALL ON TABLE "public"."plaid_accounts" TO "authenticated";
GRANT ALL ON TABLE "public"."plaid_accounts" TO "service_role";


--
-- Name: TABLE "plaid_filters"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."plaid_filters" TO "anon";
GRANT ALL ON TABLE "public"."plaid_filters" TO "authenticated";
GRANT ALL ON TABLE "public"."plaid_filters" TO "service_role";


--
-- Name: SEQUENCE "plaid_filters_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."plaid_filters_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."plaid_filters_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."plaid_filters_id_seq" TO "service_role";


--
-- Name: TABLE "plaid_transactions"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."plaid_transactions" TO "anon";
GRANT ALL ON TABLE "public"."plaid_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."plaid_transactions" TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";


--
-- PostgreSQL database dump complete
--

RESET ALL;
