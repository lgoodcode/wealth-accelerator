import type { Debt } from '@/lib/types/debts';
import type { DebtCalculationSchemaType } from './schema';

export type DebtPayoff = {
  debt: Debt;
  /** The number of months it will take to pay off the debt */
  months: number;
  /** The total amount of interest paid to pay off the debt */
  interest: number;
};

export type DebtCalculation = {
  debt_payoffs: DebtPayoff[];
  debt_tracking: number[][];
  payoff_months: number;
  total_interest: number;
  total_amount: number;
};

export type DebtCalculationResults = {
  inputs: DebtCalculationSchemaType;
  currentResults: DebtCalculation;
  strategyResults: DebtCalculation;
};
