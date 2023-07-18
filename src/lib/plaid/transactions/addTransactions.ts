import type { Transaction } from 'plaid';

import { parseTransactions } from '@/lib/plaid/transactions/parseTransactions';
import type { SupabaseServer } from '@/lib/supabase/server/createSupabase';
import type { Filter } from '../types/transactions';

export const addTransactions = async (
  item_id: string,
  transactions: Transaction[],
  filters: Filter[],
  supabase: SupabaseServer
) => {
  if (transactions.length) {
    const parsedTransactions = await parseTransactions(item_id, transactions, filters);
    const { error } = await supabase.from('plaid_transactions').upsert(parsedTransactions);
    return error;
  }

  return null;
};
