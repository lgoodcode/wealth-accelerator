import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { removeFilterAtom } from './atoms';

export const useDeleteFilter = () => {
  const removeFilter = useSetAtom(removeFilterAtom);

  return async (id: number) => {
    const { error } = await supabase.from('plaid_filters').delete().eq('id', id);

    if (error) {
      throw error;
    }

    removeFilter(id);
  };
};
