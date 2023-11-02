import { supabase } from '@/lib/supabase/client';
import type { FinanceInfoSchemaType } from '../schema';

export const useUpdateFinanceInfo = () => {
  return async (user_id: string, data: FinanceInfoSchemaType) => {
    const { error } = await supabase
      .from('personal_finance')
      .update({
        ...data,
        start_date: data.start_date.toUTCString(),
      })
      .eq('user_id', user_id);

    if (error) {
      throw error;
    }

    return data;
  };
};
