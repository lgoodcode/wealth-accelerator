import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { removeUserFilterAtom } from '../atoms';

export const useDeleteUserPlaidFilter = () => {
  const removeUserFilter = useSetAtom(removeUserFilterAtom);

  return async (id: number) => {
    const { error } = await supabase.from('global_plaid_filters').delete().eq('id', id);

    if (error) {
      throw error;
    }

    removeUserFilter(id);
  };
};
