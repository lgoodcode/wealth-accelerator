import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { removeDebtAtom } from '../atoms';

export const useDeleteDebt = () => {
  const removeDebt = useSetAtom(removeDebtAtom);

  return async (id: number) => {
    const { error } = await supabase.from('debts').delete().eq('id', id);

    if (error) {
      throw error;
    }

    removeDebt(id);
  };
};
