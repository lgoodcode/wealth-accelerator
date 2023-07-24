import { atom } from 'jotai';
import { DebtCalculation } from './types';
import { DebtCalculationSchemaType } from './schema';

export const debtSnowballAtom = atom<{
  inputs: DebtCalculationSchemaType;
  results: DebtCalculation;
} | null>(null);
