import { useAtomValue } from 'jotai';
import { useQueryClient } from '@tanstack/react-query';

import {
  ACCOUNT_BALANCES_ENTRIES_KEY,
  CCF_BALANCE_ENTRIES_KEY,
} from '@/config/constants/react-query';
import { useUser } from '@/hooks/use-user';
import { supabase } from '@/lib/supabase/client';
import { CustomError } from '@/lib/utils/CustomError';
import { selectedAccountAtom } from '../../atoms';
import type { BalancesEntry, InsertBalancesEntry } from '@/lib/types/balances';

export const useCreateEntry = () => {
  const user = useUser();
  const account = useAtomValue(selectedAccountAtom);
  const queryClient = useQueryClient();

  return async (entry: Omit<InsertBalancesEntry, 'account_id'>): Promise<BalancesEntry> => {
    if (!user) {
      throw new Error('No user signed in');
    } else if (!account) {
      throw new Error('No account selected');
    }

    const { error, data: newEntry } = await supabase
      .from('balances_entries')
      .insert({
        ...entry,
        account_id: account.id,
      })
      .select('*')
      .single();

    if (error) {
      if (error.message.toLowerCase().includes('duplicate account name')) {
        throw new CustomError(error, 'DUPLICATE_ACCOUNT_NAME');
      }
      throw error;
    }

    queryClient.setQueryData([ACCOUNT_BALANCES_ENTRIES_KEY, account.id], (oldData: any) => {
      return [...oldData, newEntry];
    });
    queryClient.setQueryData([CCF_BALANCE_ENTRIES_KEY], (oldData: any) => {
      if (!oldData) return oldData;
      return [...oldData, newEntry];
    });

    return newEntry;
  };
};
