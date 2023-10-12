CREATE TYPE plaid_account_type AS enum ('personal', 'business', 'waa');
ALTER TYPE plaid_account_type OWNER TO postgres;

ALTER TABLE plaid_accounts
ALTER COLUMN type DROP DEFAULT,
ALTER COLUMN type TYPE plaid_account_type USING type::text::plaid_account_type;

DROP TYPE account_type;
