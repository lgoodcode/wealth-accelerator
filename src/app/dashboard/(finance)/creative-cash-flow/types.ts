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
};

export type CreativeCashFlowManagementResult = {
  collections: number;
  lifestyleExpenses: number;
  lifestyleExpensesTax: number;
  businessProfitBeforeTax: number;
  businessOverhead: number;
  taxAccount: number;
  WAA: number;
  weeklyTrend: number[];
  monthlyTrend: number[];
  yearlyTrend: number[];
  yearToDate: number;
};
