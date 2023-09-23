import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { updateUserFilterAtom } from '../atoms';
import type { UpdateUserFilterFormType } from '../schema';
import type { UserFilter } from '@/lib/plaid/types/transactions';

export const useUpdateUserPlaidFilter = () => {
  const updateFilter = useSetAtom(updateUserFilterAtom);

  return async (id: number, data: UpdateUserFilterFormType) => {
    const { error, data: updatedFilter } = await supabase
      .from('user_plaid_filters')
      .update({ category: data.category })
      .eq('id', id)
      .select('*')
      .single();

    if (error || !updatedFilter) {
      throw error || new Error('Could not update filter');
    }

    updateFilter(updatedFilter as UserFilter);
  };
};
