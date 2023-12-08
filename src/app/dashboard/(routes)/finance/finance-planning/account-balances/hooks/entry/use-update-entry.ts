import { useQueryClient } from '@tanstack/react-query';

import {
  ACCOUNT_BALANCES_ENTRIES_KEY,
  CCF_BALANCE_ENTRIES_KEY,
} from '@/config/constants/react-query';
import { supabase } from '@/lib/supabase/client';
import { CustomError } from '@/lib/utils/CustomError';
import type { BalancesEntry } from '@/lib/types/balances';

export const useUpdateEntry = () => {
  const queryClient = useQueryClient();

  return async (entry: BalancesEntry): Promise<BalancesEntry> => {
    const { error, data: updatedEntry } = await supabase
      .from('balances_entries')
      .update(entry)
      .eq('id', entry.id)
      .select('*')
      .single();

    if (error) {
      if (error.message.toLowerCase().includes('duplicate account name')) {
        throw new CustomError(error, 'DUPLICATE_ACCOUNT_NAME');
      }
      throw error;
    }

    queryClient.setQueryData([ACCOUNT_BALANCES_ENTRIES_KEY, entry.account_id], (oldData: any) => {
      return oldData.map((oldEntry: BalancesEntry) => {
        if (oldEntry.id === updatedEntry.id) {
          return updatedEntry;
        }
        return oldEntry;
      });
    });
    queryClient.setQueryData([CCF_BALANCE_ENTRIES_KEY], (oldData: any) => {
      if (!oldData) return oldData;

      return oldData.map((oldEntry: BalancesEntry) => {
        if (oldEntry.id === updatedEntry.id) {
          return updatedEntry;
        }
        return oldEntry;
      });
    });

    return updatedEntry;
  };
};
