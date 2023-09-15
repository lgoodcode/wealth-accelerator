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
  debt_payoffs: {
    // Strip the debt data down to only the sorted descriptions to save space in the database
    debt: {
      description: string;
    };
    payment_tracking: number[][];
  }[];
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
  current: SimpleDebtCalculation;
  strategy: SnowballDebtCalculation;
};

export type DebtSnowballComparison = {
  current: {
    saved: number;
    cost: number;
    dateDiff: number;
    oppCost: number;
  };
  strategy: {
    saved: number;
    cost: number;
    dateDiff: number;
    oppCost: number;
  };
};

// The Debt type but with the id and user_id stripped to save space in the database
export type DebtSnowballRecordDebt = Omit<Debt, 'id' | 'user_id'>;

export type DebtSnowballRecord = {
  id: string;
  user_id: string;
  created_at: string;
  debts: DebtSnowballRecordDebt[];
  inputs: DebtCalculationInputs;
  results: DebtCalculationResults;
};
