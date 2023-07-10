import { supabase } from '@/lib/supabase/client';
import type { Filter } from '@/lib/plaid/types/transactions';

export const useCreateFilter = () => {
  return async (filter: Pick<Filter, 'filter' | 'category'>) => {
    const { error: insertError, data: newFilter } = await supabase
      .from('plaid_filters')
      .insert({
        ...filter,
        filter: filter.filter.toLowerCase(),
      })
      .select('*')
      .single();

    if (insertError || !newFilter) {
      throw insertError || new Error('Failed to insert filter');
    }

    return newFilter as Filter;
  };
};
