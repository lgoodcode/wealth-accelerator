CREATE TABLE debts (
  id int PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  amount numeric(12,2) NOT NULL,
  payment numeric(12,2) NOT NULL,
  interest numeric(5,2) NOT NULL,
  months_remaining smallint NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_debts_user_id ON debts(user_id);

ALTER TABLE debts OWNER TO postgres;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own debts or is admin" ON debts
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR (SELECT is_admin()));

CREATE POLICY "Can insert new debts" ON debts
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Can update own debt data" ON debts
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Can delete own debts" ON debts
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

