import type { Debt } from '@/lib/types/debts';

import { Strategies } from './strategies';

export type DebtPayoff = {
  debt: Debt;
  /** The number of months it will take to pay off the debt */
  months: number;
  /** The total amount of interest paid to pay off the debt */
  interest: number;
  payment_tracking: number[][];
};

export type DebtCalculation = {
  debt_payoffs: DebtPayoff[];
  balance_tracking: number[][];
  interest_tracking: number[][];
  spillover_tracking: number[][];
  payoff_months: number;
  total_interest: number;
  total_amount: number;
  total_spillover: number;
};

export type DebtCalculationInputs = {
  additional_payment?: number;
  monthly_payment: number;
  strategy: Strategies;
  lump_amounts: number[];
};

export type DebtCalculationResults = {
  currentResults: DebtCalculation;
  strategyResults: DebtCalculation;
};
