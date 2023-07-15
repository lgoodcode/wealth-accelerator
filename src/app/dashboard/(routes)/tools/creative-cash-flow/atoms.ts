import { atom } from 'jotai';

import type {
  CreativeCashFlowManagementInputs,
  CreativeCashFlowManagementResult,
  CreativeCashFlowRecord,
} from './types';

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

export const creativeCashFlowRecordsAtom = atom<CreativeCashFlowRecord[] | null>(null);

export const addCreativeCashFlowRecordAtom = atom(
  null,
  (_get, set, record: CreativeCashFlowRecord) => {
    set(creativeCashFlowRecordsAtom, (records) => {
      if (!records) {
        return [record];
      }

      return [...records, record];
    });
  }
);

export const removeCreativeCashFlowRecordAtom = atom(null, (_get, set, id: string) => {
  set(creativeCashFlowRecordsAtom, (records) => {
    if (!records) {
      throw new Error('creativeCashFlowRecordsAtom is not initialized');
    }

    const index = records.findIndex((record) => record.inputs.id === id);

    if (index === -1) {
      throw new Error('Record not found');
    }

    const newRecords = [...records];
    newRecords.splice(index, 1);

    return newRecords;
  });
});
