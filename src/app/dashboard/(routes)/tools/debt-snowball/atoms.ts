import { atom } from 'jotai';

import { Strategies } from './strategies';
import { DebtCalculationInputs, DebtCalculationResults } from './types';

export const strategyAtom = atom<Strategies | null>(null);

export const debtCalculationInputsAtom = atom<DebtCalculationInputs | null>(null);

export const debtCalculationResultsAtom = atom<DebtCalculationResults | null>(null);
