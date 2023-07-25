import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { removeNotifierAtom } from '../atoms';

export const useDeleteNotifier = () => {
  const removeNotifer = useSetAtom(removeNotifierAtom);

  return async (id: number) => {
    const { error } = await supabase.from('creative_cash_flow_notifiers').delete().eq('id', id);

    if (error) {
      throw error;
    }

    removeNotifer(id);
  };
};
