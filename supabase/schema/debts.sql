DROP TABLE IF EXISTS debts CASCADE;
CREATE TABLE debts (
  id int PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  amount numeric(12,2) NOT NULL,
  payment numeric(12,2) NOT NULL,
  interest numeric(5,2) NOT NULL,
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
