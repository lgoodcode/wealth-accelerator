import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { padLastArrayWithZeros } from '../utils/multi-dim-arr-padding';
import { addDebtSnowballRecordAtom } from '../atoms';
import type { Debt } from '@/lib/types/debts';
import type { DebtCalculationInputs, DebtCalculationResults, DebtSnowballRecord } from '../types';

export const useSaveDebtSnowballRecord = () => {
  // const addRecord = useSetAtom(addDebtSnowballRecordAtom);

  return async (
    userId: string,
    debts: Debt[],
    inputs: DebtCalculationInputs,
    results: DebtCalculationResults
  ) => {
    // Strip the id and user_id from the debts, which isn't needed to view, to save space in the database
    const strippedDebts = debts.map((debt) => ({
      description: debt.description,
      amount: debt.amount,
      interest: debt.interest,
      payment: debt.payment,
      months_remaining: debt.months_remaining,
    }));

    // To insert the multi-dimensional arrays into the database, they need to all be the same length
    // so we will pad the last array with zeros to make them all the same length
    padLastArrayWithZeros(results.current.balance_tracking);
    padLastArrayWithZeros(results.strategy.balance_tracking);
    padLastArrayWithZeros(results.strategy.loan_payback.tracking);

    const { error, data: record_id } = await supabase.rpc('create_debt_snowball_record', {
      user_id: userId,
      debts: strippedDebts,
      inputs,
      results,
    });

    if (error) {
      throw error;
    } else if (!record_id) {
      throw new Error('No record id returned from database');
    }

    // const record: DebtSnowballRecord = {
    //   id: record_id,
    //   debts: strippedDebts,
    //   inputs: structuredClone(inputs),
    //   results: structuredClone(results),
    // };

    // console.log({ record });

    // addRecord(record);
  };
};
