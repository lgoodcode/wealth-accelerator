import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { updateFilterAtom } from '../atoms';
import type { UpdateFilterFormType } from '../schemas';
import type { Filter } from '@/lib/plaid/types/transactions';

export const useUpdateFilter = () => {
  const updateFilter = useSetAtom(updateFilterAtom);

  return async (id: number, data: UpdateFilterFormType) => {
    const { error, data: updatedFilter } = await supabase
      .from('plaid_filters')
      .update({ category: data.category })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    updateFilter(updatedFilter as Filter);
  };
};
