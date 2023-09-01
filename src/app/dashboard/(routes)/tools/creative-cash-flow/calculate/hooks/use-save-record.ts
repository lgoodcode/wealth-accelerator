import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { addCreativeCashFlowRecordAtom } from '../../atoms';
import type {
  CreativeCashFlowManagementInputs,
  CreativeCashFlowManagementResult,
  CreativeCashFlowRecord,
} from '../../types';

export const useSaveRecord = () => {
  const addRecord = useSetAtom(addCreativeCashFlowRecordAtom);

  return async (
    user_id: string,
    inputs: CreativeCashFlowManagementInputs,
    results: CreativeCashFlowManagementResult
  ) => {
    const { error, data: record_id } = await supabase.rpc('create_creative_cash_flow', {
      _user_id: user_id,
      _start_date: inputs.start_date!.toUTCString(),
      _end_date: inputs.end_date!.toUTCString(),
      _all_other_income: inputs.all_other_income,
      _payroll_and_distributions: inputs.payroll_and_distributions,
      _lifestyle_expenses_tax_rate: inputs.lifestyle_expenses_tax_rate,
      _tax_account_rate: inputs.tax_account_rate,
      _optimal_savings_strategy: inputs.optimal_savings_strategy,
      _collections: results.collections,
      _lifestyle_expenses: results.lifestyle_expenses,
      _lifestyle_expenses_tax: results.lifestyle_expenses_tax,
      _business_profit_before_tax: results.business_profit_before_tax,
      _business_overhead: results.business_overhead,
      _tax_account: results.tax_account,
      _waa: results.waa,
      _total_waa: results.total_waa,
      _daily_trend: results.daily_trend,
      _weekly_trend: results.weekly_trend,
      _yearly_trend: results.yearly_trend,
      _year_to_date: results.year_to_date,
    });

    if (error) {
      throw error;
    }

    const record = {
      inputs: {
        ...structuredClone(inputs),
        id: record_id,
      },
      results: {
        ...structuredClone(results),
        id: record_id,
      },
    } as CreativeCashFlowRecord;

    addRecord(record);
  };
};
