import { supabase } from '@/lib/supabase/client';
import { generateUUID } from '@/lib/utils/uuid';
import type {
  CreativeCashFlowManagementInputs,
  CreativeCashFlowManagementResult,
  CreativeCashFlowRecord,
} from '../types';

export const useSaveRecord = () => {
  return async (
    user_id: string,
    inputs: CreativeCashFlowManagementInputs,
    results: CreativeCashFlowManagementResult
  ): Promise<CreativeCashFlowRecord> => {
    const id = generateUUID();
    const { error: inputsError, data: newInputs } = await supabase
      .from('creative_cash_flow_inputs')
      .insert({
        id,
        user_id,
        ...inputs,
        start_date: inputs.start_date!.toUTCString(),
        end_date: inputs.end_date!.toUTCString(),
      })
      .eq('user_id', user_id)
      .select()
      .single();

    if (inputsError) {
      throw inputsError;
    }

    const { error: resultsError, data: newResults } = await supabase
      .from('creative_cash_flow_results')
      .insert({
        id,
        user_id,
        ...results,
      })
      .eq('user_id', user_id)
      .select()
      .single();

    if (resultsError) {
      throw resultsError;
    }

    return {
      inputs: newInputs,
      results: newResults,
    } as unknown as CreativeCashFlowRecord;
  };
};
