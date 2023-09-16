import { atom } from 'jotai';

import { Strategies } from './strategies';
import type { Debt } from '@/lib/types/debts';
import type {
  DebtCalculationInputs,
  DebtCalculationResults,
  DebtSnowballComparison,
  DebtSnowballRecord,
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

/**
 * Records
 */

export const debtSnowballRecordsAtom = atom<DebtSnowballRecord[] | null>(null);

export const addDebtSnowballRecordAtom = atom(null, (_get, set, record: DebtSnowballRecord) => {
  set(debtSnowballRecordsAtom, (records) => {
    if (!records) {
      return [record];
    }

    return [...records, record];
  });
});

export const renameDebtSnowballRecordAtom = atom(null, (_get, set, id: string, name: string) => {
  set(debtSnowballRecordsAtom, (records) => {
    if (!records) {
      throw new Error('debtSnowballRecordsAtom is not initialized');
    }

    const index = records.findIndex((record) => record.id === id);

    if (index === -1) {
      throw new Error('Record not found');
    }

    const newRecords = [...records];
    newRecords[index].name = name;

    return newRecords;
  });
});

export const removeDebtSnowballRecordAtom = atom(null, (_get, set, id: string) => {
  set(debtSnowballRecordsAtom, (records) => {
    if (!records) {
      throw new Error('debtSnowballRecordsAtom is not initialized');
    }

    const index = records.findIndex((record) => record.id === id);

    if (index === -1) {
      throw new Error('Record not found');
    }

    const newRecords = [...records];
    newRecords.splice(index, 1);

    return newRecords;
  });
});
