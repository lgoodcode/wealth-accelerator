INSERT INTO plaid_filters (filter, category)
VALUES
  ('transfer', 'Transfer'::category),
  ('deposit', 'Money-In'::category),
  ('square', 'Money-In'::category),
  ('bankcard', 'Money-In'::category),
  ('mobile deposit', 'Money-In'::category),
  ('merchant', 'Money-In'::category),
  ('esquire', 'Money-In'::category),
  ('stripe', 'Money-In'::category),
  ('venmo', 'Money-Out'::category),
  ('fullscript', 'Money-In'::category),
  ('check', 'Money-Out'::category),
  ('synchrony', 'Money-In'::category),
  ('commerce', 'Money-In'::category),
  ('hcclaimpmt', 'Money-In'::category),
  ('clearent', 'Money-In'::category);
