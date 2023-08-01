import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { updateDebtAtom } from '../atoms';
import type { DebtFormType } from '../schema';

export const useUpdateDebt = () => {
  const router = useRouter();
  const updateDebt = useSetAtom(updateDebtAtom);

  return async (id: number, data: DebtFormType) => {
    const { error, data: updatedDebt } = await supabase
      .from('debts')
      .update(data)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    updateDebt(updatedDebt);
    // Refresh to force update the debts in debt snowball and other places where the debts are used
    router.refresh();
  };
};
