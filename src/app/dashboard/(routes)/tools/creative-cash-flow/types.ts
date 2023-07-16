import type { Transaction } from '@/lib/plaid/types/transactions';

export type CreativeCashFlowManagementInputs = {
  start_date: Date | undefined;
  end_date: Date | undefined;
  all_other_income: number;
  payroll_and_distributions: number;
  /** The rate is given as a whole number and needs to be divided by 100 */
  lifestyle_expenses_tax_rate: number;
  /** The rate is given as a whole number and needs to be divided by 100 */
  tax_account_rate: number;
  optimal_savings_strategy: number;
};

export type CreativeCashFlowManagementArgs = CreativeCashFlowManagementInputs & {
  business_transactions: Transaction[];
  personal_transactions: Transaction[];
  ytd_collections: number;
};

export type CreativeCashFlowManagementResult = {
  collections: number;
  lifestyle_expenses: number;
  lifestyle_expenses_tax: number;
  business_profit_before_tax: number;
  business_overhead: number;
  /** tax on business profit */
  tax_account: number;
  waa: number;
  total_waa: number;
  weekly_trend: number[];
  monthly_trend: number[];
  yearly_trend: number[];
  year_to_date: number;
};

export type CreativeCashFlowRecord = {
  inputs: CreativeCashFlowManagementInputs & {
    id: string;
    start_date: string;
    end_date: string;
  };
  results: CreativeCashFlowManagementResult & {
    id: string;
  };
};
