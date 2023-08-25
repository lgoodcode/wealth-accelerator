ALTER TABLE creative_cash_flow_inputs
ALTER COLUMN all_other_income TYPE numeric(12,2),
ALTER COLUMN payroll_and_distributions TYPE numeric(12,2),
ALTER COLUMN optimal_savings_strategy TYPE numeric(12,2),
ALTER COLUMN lifestyle_expenses_tax_rate TYPE numeric(5,2),
ALTER COLUMN tax_account_rate TYPE numeric(5,2);

ALTER TABLE creative_cash_flow_results
ALTER COLUMN collections TYPE numeric(12,2),
ALTER COLUMN lifestyle_expenses TYPE numeric(12,2),
ALTER COLUMN lifestyle_expenses_tax TYPE numeric(12,2),
ALTER COLUMN business_profit_before_tax TYPE numeric(12,2),
ALTER COLUMN business_overhead TYPE numeric(12,2),
ALTER COLUMN tax_account TYPE numeric(12,2),
ALTER COLUMN waa TYPE numeric(12,2),
ALTER COLUMN total_waa TYPE numeric(12,2),
ALTER COLUMN weekly_trend TYPE numeric(12,2)[],
ALTER COLUMN monthly_trend TYPE numeric(12,2)[],
ALTER COLUMN yearly_trend TYPE numeric(12,2)[],
ALTER COLUMN year_to_date TYPE numeric(12,2);
