import { atom } from 'jotai';

import type { CreativeCashFlowManagementInputs, CreativeCashFlowManagementResult } from './types';

export const isInputsOpenAtom = atom(false);

const defaultValues = {
  start_date: undefined,
  end_date: undefined,
  all_other_income: 0,
  payroll_and_distributions: 0,
  lifestyle_expenses_tax_rate: 25,
  tax_account_rate: 30,
  optimal_savings_strategy: 0,
};

export const creativeCashFlowInputsAtom = atom<CreativeCashFlowManagementInputs>(defaultValues);

export const resetCreativeCashFlowInputsAtom = atom(null, (_, set) => {
  set(creativeCashFlowInputsAtom, defaultValues);
});

export const creativeCashFlowResultAtom = atom<CreativeCashFlowManagementResult | null>(null);
