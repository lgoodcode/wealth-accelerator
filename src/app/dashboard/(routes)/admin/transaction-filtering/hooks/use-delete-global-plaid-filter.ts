import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { removeGlobalFilterAtom } from '../atoms';

export const useDeleteGlobalPlaidFilter = () => {
  const removeGlobalFilter = useSetAtom(removeGlobalFilterAtom);

  return async (id: number) => {
    const { error } = await supabase.from('global_plaid_filters').delete().eq('id', id);

    if (error) {
      throw error;
    }

    removeGlobalFilter(id);
  };
};
