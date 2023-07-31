import type { Debt } from '@/lib/types/debts';

import { Strategies } from './strategies';

export type DebtPayoff = {
  debt: Debt;
  /** The number of months it will take to pay off the debt */
  months: number;
  /** The total amount of interest paid to pay off the debt */
  interest: number;
};

export type DebtCalculation = {
  debt_payoffs: DebtPayoff[];
  balance_tracking: number[][];
  interest_tracking: number[][];
  payoff_months: number;
  total_interest: number;
  total_amount: number;
};

export type DebtCalculationInputs = {
  target_date?: Date;
  additional_payment?: number;
  monthly_payment: number;
  strategy: Strategies;
  lump_amounts: number[];
};

export type DebtCalculationResults = {
  currentResults: DebtCalculation;
  strategyResults: DebtCalculation;
};
