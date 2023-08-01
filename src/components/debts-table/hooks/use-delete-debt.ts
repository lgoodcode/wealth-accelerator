import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { removeDebtAtom } from '../atoms';

export const useDeleteDebt = () => {
  const router = useRouter();
  const removeDebt = useSetAtom(removeDebtAtom);

  return async (id: number) => {
    const { error } = await supabase.from('debts').delete().eq('id', id);

    if (error) {
      throw error;
    }

    removeDebt(id);
    // Refresh to force update the debts in debt snowball and other places where the debts are used
    router.refresh();
  };
};
