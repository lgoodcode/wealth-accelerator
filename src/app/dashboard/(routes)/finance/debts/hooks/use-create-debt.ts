import { useSetAtom } from 'jotai';

import { useUser } from '@/hooks/use-user';
import { supabase } from '@/lib/supabase/client';
import { addDebtAtom } from '../atoms';
import type { DebtFormType } from '../schema';

export const useCreateDebt = () => {
  const user = useUser();
  const addDebt = useSetAtom(addDebtAtom);

  return async (debt: DebtFormType) => {
    if (!user) {
      throw new Error('User is not authenticated');
    }

    const { error: insertError, data: newDebt } = await supabase
      .from('debts')
      .insert({
        ...debt,
        user_id: user.id,
      })
      .select('*')
      .single();

    if (insertError || !newDebt) {
      throw insertError || new Error('Failed to insert debt');
    }

    addDebt(newDebt);
  };
};
