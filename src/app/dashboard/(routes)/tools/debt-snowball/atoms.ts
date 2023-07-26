import { atom } from 'jotai';

import { DebtCalculationInputs, DebtCalculationResults } from './types';

export const debtCalculationInputsAtom = atom<DebtCalculationInputs | null>(null);

export const debtCalculationResultsAtom = atom<DebtCalculationResults | null>(null);
