import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { updateGlobalFilterAtom } from '../atoms';
import type { UpdateGlobalFilterFormType } from '../schema';
import type { Filter } from '@/lib/plaid/types/transactions';

export const useUpdateGlobalPlaidFilter = () => {
  const updateFilter = useSetAtom(updateGlobalFilterAtom);

  return async (id: number, data: UpdateGlobalFilterFormType) => {
    const { error, data: updatedFilter } = await supabase
      .from('global_plaid_filters')
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
