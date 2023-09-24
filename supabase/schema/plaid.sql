
DROP TABLE IF EXISTS plaid CASCADE;
CREATE TABLE plaid (
  item_id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  access_token text UNIQUE NOT NULL,
  expiration timestamp with time zone NOT NULL,
  cursor text -- used to track last transactions synced
);

CREATE INDEX IF NOT EXISTS idx_plaid_user_id ON plaid(user_id);

ALTER TABLE plaid OWNER TO postgres;
ALTER TABLE plaid ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own institutions" ON public.plaid
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Can insert new institutions" ON public.plaid
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Can update own institutions" ON public.plaid
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Can delete own institutions" ON public.plaid
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);



-- Only allow the "name, cursor, expiration" columns to be updated
CREATE OR REPLACE FUNCTION verify_update_plaid()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

ALTER FUNCTION verify_update_plaid() OWNER TO postgres;

DROP TRIGGER IF EXISTS on_update_plaid ON plaid;
CREATE TRIGGER on_update_plaid
  BEFORE UPDATE ON plaid
    FOR EACH ROW
      EXECUTE FUNCTION verify_update_plaid();
