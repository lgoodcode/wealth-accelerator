import type { Debt } from '@/lib/types/debts';

export type DebtPayoff = {
  debt: Debt;
  /** The number of months it will take to pay off the debt */
  months: number;
  /** The total amount of interest paid to pay off the debt */
  interest: number;
};

export type DebtCalculation = {
  debtPayoffs: DebtPayoff[];
  debtTracking: number[][];
  totalInterestPaid: number;
  payoffMonths: number;
  totalPaid: number;
};
