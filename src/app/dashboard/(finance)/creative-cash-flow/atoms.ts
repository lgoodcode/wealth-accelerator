import { atom } from 'jotai';

import type { CreativeCashFlowManagementInputs, CreativeCashFlowManagementResult } from './types';

export const isInputsOpenAtom = atom(false);

export const creativeCashFlowInputsAtom = atom<CreativeCashFlowManagementInputs>({
  start_date: undefined,
  end_date: undefined,
  all_other_income: 0,
  payroll_and_distributions: 0,
  lifestyle_expenses_tax_rate: 0,
  tax_account_rate: 25,
  optimal_savings_strategy: 0,
});

export const creativeCashFlowResultAtom = atom<CreativeCashFlowManagementResult | null>(null);
