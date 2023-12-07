import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { removeAccountAtom } from '../atoms';

export const useDeleteAccount = () => {
  const removeAccount = useSetAtom(removeAccountAtom);

  return async (id: number) => {
    const { error } = await supabase.from('balances_accounts').delete().eq('id', id);

    if (error) {
      throw error;
    }

    removeAccount(id);
  };
};
