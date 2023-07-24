import type { Transaction } from 'plaid';

import { parseTransactions } from '@/lib/plaid/transactions/parseTransactions';
import type { SupabaseServer } from '@/lib/supabase/server/create-supabase';
import type { Filter } from '../types/transactions';

export const updateTransactions = async (
  item_id: string,
  transactions: Transaction[],
  filters: Filter[],
  supabase: SupabaseServer
) => {
  if (transactions.length) {
    const parsedTransactions = await parseTransactions(item_id, transactions, filters);
    const { error } = await supabase.from('plaid_transactions').upsert(parsedTransactions, {
      onConflict: 'id', // Update transactions with the same id
    });

    return error;
  }

  return null;
};
