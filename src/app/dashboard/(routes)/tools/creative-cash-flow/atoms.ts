import { atom } from 'jotai';

import type {
  CreativeCashFlowManagementInputs,
  CreativeCashFlowManagementResult,
  CreativeCashFlowRecord,
} from './types';

type UpdateWaa = {
  originalTotalWaa: number;
  newWaa: number;
};

const defaultValues = {
  start_date: undefined,
  end_date: undefined,
  all_other_income: 0,
  payroll_and_distributions: 0,
  lifestyle_expenses_tax_rate: 25,
  tax_account_rate: 0,
  optimal_savings_strategy: 0,
};

export const ccfInputsAtom = atom<CreativeCashFlowManagementInputs>(defaultValues);

export const resetCreativeCashFlowInputsAtom = atom(null, (_, set) => {
  set(ccfInputsAtom, defaultValues);
});

export const ccfResultsAtom = atom<CreativeCashFlowManagementResult | null>(null);

export const updatecreativeCashFlowResultWaaAtom = atom(
  null,
  (get, set, { originalTotalWaa, newWaa }: UpdateWaa) => {
    const results = get(ccfResultsAtom);

    if (!results) {
      throw new Error('creativeCashFlowResultAtom is not initialized');
    }

    set(ccfResultsAtom, {
      ...results,
      waa: newWaa,
      total_waa: originalTotalWaa + newWaa,
    });
  }
);

/**
 * Records
 */

export const ccfRecordsAtom = atom<CreativeCashFlowRecord[] | null>(null);

export const addCcfRecordAtom = atom(null, (_get, set, record: CreativeCashFlowRecord) => {
  set(ccfRecordsAtom, (records) => {
    if (!records) {
      return [record];
    }

    return [...records, record];
  });
});

export const renameCcfRecordAtom = atom(null, (_get, set, id: string, name: string) => {
  set(ccfRecordsAtom, (records) => {
    if (!records) {
      return null;
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

export const removeCcfRecordAtom = atom(null, (_get, set, id: string) => {
  set(ccfRecordsAtom, (records) => {
    if (!records) {
      throw new Error('creativeCashFlowRecordsAtom is not initialized');
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
