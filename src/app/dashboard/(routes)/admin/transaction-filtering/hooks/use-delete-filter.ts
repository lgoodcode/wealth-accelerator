import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { removeGlobalFilterAtom } from '../atoms';

export const useDeleteFilter = () => {
  const removeFilter = useSetAtom(removeGlobalFilterAtom);

  return async (id: number) => {
    const { error } = await supabase.from('plaid_filters').delete().eq('id', id);

    if (error) {
      throw error;
    }

    removeFilter(id);
  };
};
