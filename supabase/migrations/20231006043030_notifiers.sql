DROP TABLE IF EXISTS notifiers CASCADE;
CREATE TABLE notifiers (
  id int PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  contact_email boolean NOT NULL DEFAULT false,
  creative_cash_flow boolean NOT NULL DEFAULT false,
  debt_snowball boolean NOT NULL DEFAULT false
);

ALTER TABLE notifiers OWNER TO postgres;
ALTER TABLE notifiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view notifiers" ON notifiers
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "Admins can insert notifiers" ON notifiers
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "Admins can update notifiers" ON notifiers
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "Admins can delete notifiers" ON notifiers
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));
