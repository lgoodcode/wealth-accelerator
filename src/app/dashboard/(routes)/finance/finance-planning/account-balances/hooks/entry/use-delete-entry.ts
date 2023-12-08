import { useAtomValue } from 'jotai';
import { useQueryClient } from '@tanstack/react-query';

import { ACCOUNT_BALANCES_ENTRIES_KEY } from '@/config/constants/react-query';
import { supabase } from '@/lib/supabase/client';
import { selectedAccountAtom } from '../../atoms';
import type { BalancesEntry } from '@/lib/types/balances';

export const useDeleteEntry = () => {
  const account = useAtomValue(selectedAccountAtom);
  const queryClient = useQueryClient();

  return async (id: number): Promise<void> => {
    if (!account) {
      throw new Error('No account selected');
    }

    const { error } = await supabase.from('balances_entries').delete().eq('id', id);

    if (error) {
      throw error;
    }

    queryClient.setQueryData([ACCOUNT_BALANCES_ENTRIES_KEY, account.id], (oldData: any) => {
      return oldData.filter((entry: BalancesEntry) => entry.id !== id);
    });
  };
};
