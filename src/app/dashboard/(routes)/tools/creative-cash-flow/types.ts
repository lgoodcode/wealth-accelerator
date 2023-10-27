import type { Category, Transaction } from '@/lib/plaid/types/transactions';

export type CreativeCashFlowManagementInputs = {
  start_date: Date;
  end_date: Date;
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
  /** The value of the bank account WAA snapshot */
  actual_waa: number | null;
  daily_trend: number[];
  weekly_trend: number[];
  yearly_trend: number[];
  year_to_date: number;
};

export type CreativeCashFlowRecord = {
  id: string;
  name: string;
  created_at: string;
  inputs: CreativeCashFlowManagementInputs & {
    start_date: string;
    end_date: string;
  };
  results: CreativeCashFlowManagementResult;
};

export type CcfTransaction = {
  id: string;
  item_id: string;
  name: string;
  amount: number;
  category: Category;
  date: string;
};

export type VisualizeCcf = {
  range: {
    start: Date;
    end: Date;
  };
  collections: number;
  lifestyle_expenses: number;
  lifestyle_expenses_tax: number;
  business_profit_before_tax: number;
  business_overhead: number;
  tax_account: number;
  waa: number;
};

export type VisualizeCcfDataKey = keyof Omit<VisualizeCcf, 'range'>;
