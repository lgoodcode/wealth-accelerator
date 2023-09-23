import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { removeUserFilterAtom } from '../atoms';

export const useDeleteUserPlaidFilter = () => {
  const removeUserFilter = useSetAtom(removeUserFilterAtom);

  return async (id: number, global_filter_id: number) => {
    const { error } = await supabase.rpc('delete_user_plaid_filter', {
      filter_id: id,
      global_filter_id: global_filter_id === -1 ? undefined : global_filter_id,
    });

    if (error) {
      throw error;
    }

    removeUserFilter(id);
  };
};
