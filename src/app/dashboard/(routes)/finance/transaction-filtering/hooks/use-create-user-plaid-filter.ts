import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { addUserFilterAtom } from '../atoms';
import type { Filter } from '@/lib/plaid/types/transactions';

export const useCreateUserPlaidFilter = () => {
  const addUserFilter = useSetAtom(addUserFilterAtom);

  return async (filter: Pick<Filter, 'filter' | 'category'>) => {
    const { error, data: globalFilter } = await supabase
      .from('user_plaid_filters')
      .insert({
        filter: filter.filter.toLowerCase(),
        category: filter.category,
      })
      .select('*')
      .single();

    if (error || !globalFilter) {
      throw error || new Error('Could not create filter');
    }

    addUserFilter(globalFilter as Filter);
  };
};
