import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { removeGlobalFilterAtom } from '../atoms';

export const useDeleteGlobalPlaidFilter = () => {
  const removeGlobalFilter = useSetAtom(removeGlobalFilterAtom);

  return async (id: number, global_filter_id: number) => {
    const { error } = await supabase.rpc('delete_global_plaid_filter', {
      filter_id: id,
      new_filter_id: global_filter_id === -1 ? undefined : global_filter_id,
    });

    if (error) {
      throw error;
    }

    removeGlobalFilter(id);
  };
};
