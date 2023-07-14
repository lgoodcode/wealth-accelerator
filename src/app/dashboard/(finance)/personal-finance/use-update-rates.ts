import { supabase } from '@/lib/supabase/client';
import type { RatesFormSchemaType } from './schema';

export const useUpdateRates = () => {
  return async (user_id: string, data: RatesFormSchemaType) => {
    console.log(data);
    const { error } = await supabase
      .from('personal_finance')
      .update({ rates: data.rates })
      .eq('user_id', user_id);

    if (error) {
      throw error;
    }
  };
};
