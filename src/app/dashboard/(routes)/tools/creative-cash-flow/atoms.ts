import { atom } from 'jotai';

import type {
  CreativeCashFlowManagementInputs,
  CreativeCashFlowManagementResult,
  CreativeCashFlowRecord,
} from './types';
import type { VisualizeCcf } from './types';

const defaultValues: CreativeCashFlowManagementInputs = {
  // @ts-ignore
  start_date: undefined,
  // @ts-ignore
  end_date: undefined,
  all_other_income: 0,
  payroll_and_distributions: 0,
  lifestyle_expenses_tax_rate: 25,
  tax_account_rate: 0,
  optimal_savings_strategy: 0,
};

/** @ts-ignore */
export const ccfInputsAtom = atom<CreativeCashFlowManagementInputs>(defaultValues);

export const resetCreativeCashFlowInputsAtom = atom(null, (_, set) => {
  set(ccfInputsAtom, defaultValues);
});

export const ccfResultsAtom = atom<CreativeCashFlowManagementResult | null>(null);

export const hasActualWaaAtom = atom<boolean | null>(null);

export const updateActualWaaAtom = atom(null, (_get, set, actualWaa: number) => {
  set(ccfResultsAtom, (results) => {
    if (!results) {
      throw new Error('ccfResultsAtom is not initialized');
    }

    return {
      ...results,
      actual_waa: actualWaa,
    };
  });
});

export const visualizeCcfAtom = atom<VisualizeCcf[]>([]);

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
