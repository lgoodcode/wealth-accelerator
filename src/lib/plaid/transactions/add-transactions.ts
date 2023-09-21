import type { Transaction } from 'plaid';

import { parseTransactions } from '@/lib/plaid/transactions/parse-transactions';
import type { SupabaseServer } from '@/lib/supabase/server/create-supabase';
import type { Filter } from '../types/transactions';

export const addTransactions = async (
  item_id: string,
  transactions: Transaction[],
  user_filters: Filter[],
  global_filters: Filter[],
  supabase: SupabaseServer
) => {
  if (transactions.length) {
    const parsedTransactions = await parseTransactions(
      item_id,
      transactions,
      user_filters,
      global_filters
    );
    const { error } = await supabase.from('plaid_transactions').upsert(parsedTransactions, {
      onConflict: 'id',
      ignoreDuplicates: true,
    });
    return error;
  }

  return null;
};
