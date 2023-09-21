import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { addGlobalFilterAtom } from '../atoms';
import type { Filter } from '@/lib/plaid/types/transactions';

export const useCreateGlobalPlaidFilter = () => {
  const addGlobalFilter = useSetAtom(addGlobalFilterAtom);

  return async (filter: Pick<Filter, 'filter' | 'category'>) => {
    const { error, data: globalFilter } = await supabase
      .from('global_plaid_filters')
      .insert({
        filter: filter.filter.toLowerCase(),
        category: filter.category,
      })
      .select('*')
      .single();

    if (error || !globalFilter) {
      throw error || new Error('Could not create filter');
    }

    addGlobalFilter(globalFilter as Filter);
  };
};
