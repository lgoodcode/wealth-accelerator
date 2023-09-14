import { atom } from 'jotai';

import { Strategies } from './strategies';
import type { Debt } from '@/lib/types/debts';
import type {
  DebtCalculationInputs,
  DebtCalculationResults,
  DebtSnowballComparison,
} from './types';

export const debtsAtom = atom<Debt[] | null>(null);

export const debtCalculationInputsAtom = atom<DebtCalculationInputs | null>(null);

export const debtCalculationResultsAtom = atom<DebtCalculationResults | null>(null);

export const debtSnowballComparisonAtom = atom<DebtSnowballComparison | null>(null);

export const sortDebtsAtom = atom(null, (get, set, strategy: Strategies) => {
  if (!strategy) {
    return;
  }

  const debts = structuredClone(get(debtsAtom));

  if (!debts) {
    return;
  }

  if (
    strategy === Strategies.WealthAcceleratorLowestBalance ||
    strategy === Strategies.LowestBalance
  ) {
    debts.sort((a, b) => a.amount - b.amount);
  } else if (
    strategy === Strategies.WealthAcceleratorHighestBalance ||
    strategy === Strategies.HighestBalance
  ) {
    debts.sort((a, b) => b.amount - a.amount);
  } else if (
    strategy === Strategies.WealthAcceleratorHighestInterest ||
    strategy === Strategies.HighestInterest
  ) {
    debts.sort((a, b) => b.interest - a.interest);
  } else if (
    strategy === Strategies.WealthAcceleratorLowestInterest ||
    strategy === Strategies.LowestInterest
  ) {
    debts.sort((a, b) => a.interest - b.interest);
  } else {
    throw new Error('Invalid strategy');
  }

  set(debtsAtom, debts);
});
