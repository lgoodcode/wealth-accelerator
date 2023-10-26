import { useRouter } from 'next/navigation';

import { supabase } from '@/lib/supabase/client';
import type { ratesFormSchema } from '../schema';

export const useUpdateRates = () => {
  const router = useRouter();

  return async (user_id: string, data: RatesFormSchema) => {
    console.log(data);
    const { error } = await supabase
      .from('personal_finance')
      .update({ rates: data.rates })
      .eq('user_id', user_id);

    if (error) {
      throw error;
    }

    // Refresh to force the data to be re-fetched from the server wherever the rates are used
    router.refresh();
  };
};
