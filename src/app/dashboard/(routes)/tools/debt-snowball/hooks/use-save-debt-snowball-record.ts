import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import type { DebtCalculationInputs, DebtCalculationResults, DebtSnowballRecord } from '../types';
import type { Debt } from '@/lib/types/debts';

export const useSaveDebtSnowballRecord = () => {
  // const addRecord = useSetAtom(addCreativeCashFlowRecordAtom);

  return async (
    userId: string,
    debts: Debt[],
    inputs: DebtCalculationInputs,
    results: DebtCalculationResults
  ) => {
    const { error, data: record_id } = await supabase.rpc('create_debt_snowball', {});

    if (error) {
      throw error;
    }
    const record = {
      debts,
      inputs: {
        ...structuredClone(inputs),
        id: record_id,
      },
      results: {
        ...structuredClone(results),
        id: record_id,
      },
    } as DebtSnowballRecord;

    // addRecord(record);
  };
};
