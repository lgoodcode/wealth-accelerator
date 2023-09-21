import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { addGlobalFilterAtom } from '../atoms';
import type { Filter } from '@/lib/plaid/types/transactions';

export const useCreateFilter = () => {
  const addFilter = useSetAtom(addGlobalFilterAtom);

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

    addFilter(newFilter as Filter);
  };
};
