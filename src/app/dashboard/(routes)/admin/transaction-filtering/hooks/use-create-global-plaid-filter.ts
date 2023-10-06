import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { addGlobalFilterAtom } from '../atoms';
import type { Filter } from '@/lib/plaid/types/transactions';
import type { CreateGlobalFilterForm } from '../schema';

export const useCreateGlobalPlaidFilter = () => {
  const addGlobalFilter = useSetAtom(addGlobalFilterAtom);

  return async (data: CreateGlobalFilterForm) => {
    const { error, data: globalFilter } = await supabase
      .rpc('create_global_plaid_filter', {
        _filter: {
          filter: data.filter,
          category: data.category,
        },
        override: data.override ?? false,
      })
      .select('*')
      .single();

    if (error || !globalFilter) {
      throw error || new Error('Could not create filter');
    }

    addGlobalFilter(globalFilter as Filter);
  };
};
