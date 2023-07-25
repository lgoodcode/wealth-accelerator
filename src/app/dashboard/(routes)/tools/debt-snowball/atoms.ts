import { atom } from 'jotai';

import type { DebtCalculationResults } from './types';

export const debtCalculationResultsAtom = atom<DebtCalculationResults | null>(null);
