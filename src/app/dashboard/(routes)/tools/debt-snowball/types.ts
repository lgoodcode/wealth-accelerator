import { Strategies } from './strategies';
import type { Debt } from '@/lib/types/debts';

export type DebtPayoff = {
  debt: Debt;
  /** The number of months it will take to pay off the debt */
  months: number;
  /** The total amount of interest paid to pay off the debt */
  interest: number;
  payment_tracking: number[][];
};

export type SimpleDebtCalculation = {
  debt_payoffs: DebtPayoff[];
  balance_tracking: number[][];
  interest_tracking: number[][];
  payoff_months: number;
  total_interest: number;
  total_amount: number;
};

export type SnowballDebtCalculation = SimpleDebtCalculation & {
  snowball_tracking: number[][];
  loan_payback: {
    total: number;
    interest: number;
    months: number;
    tracking: number[][];
  };
};

export type DebtCalculationInputs = {
  additional_payment: number;
  monthly_payment: number;
  opportunity_rate: number;
  strategy: Strategies;
  lump_amounts: number[];
  pay_back_loan: boolean;
  pay_interest: boolean; // Currently unused
  loan_interest_rate: number;
};

export type DebtCalculationResults = {
  currentResults: SimpleDebtCalculation;
  strategyResults: SnowballDebtCalculation;
};

export type DebtSnowballComparison = {
  currentSaved: number;
  currentCost: number;
  strategySaved: number;
  strategyCost: number;
  currentDateDiff: number;
  strategyDateDiff: number;
  currentOppCost: number;
  strategyOppCost: number;
};
