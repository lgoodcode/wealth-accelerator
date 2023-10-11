import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { addCreativeCashFlowRecordAtom } from '../atoms';
import type {
  CreativeCashFlowManagementInputs,
  CreativeCashFlowManagementResult,
  CreativeCashFlowRecord,
} from '../types';

export const useSaveCcfRecord = () => {
  const addRecord = useSetAtom(addCreativeCashFlowRecordAtom);

  return async (
    user_id: string,
    name: string,
    inputs: CreativeCashFlowManagementInputs,
    results: CreativeCashFlowManagementResult
  ) => {
    const { error, data } = await supabase
      .rpc('create_creative_cash_flow', {
        _user_id: user_id,
        name,
        inputs: {
          ...inputs,
          start_date: inputs.start_date!.toUTCString(),
          end_date: inputs.end_date!.toUTCString(),
        },
        results,
      })
      .single();

    if (error || !data) {
      throw error || new Error('No data returned from create_creative_cash_flow');
    }

    const record = {
      id: data.id,
      name,
      created_at: data.created_at,
      inputs: { ...structuredClone(inputs) },
      results: { ...structuredClone(results) },
    } as CreativeCashFlowRecord;

    addRecord(record);
  };
};
