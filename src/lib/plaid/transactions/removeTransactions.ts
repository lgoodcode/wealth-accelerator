import type { RemovedTransaction } from 'plaid';

import type { SupabaseServer } from '@/lib/supabase/server/createSupabase';

export const removeTransactions = async (
  transactions: RemovedTransaction[],
  supabase: SupabaseServer
) => {
  if (transactions.length) {
    const transaction_ids = transactions.map((transaction) => transaction.transaction_id);
    const { error } = await supabase.from('plaid_transactions').delete().in('id', transaction_ids);
    return error;
  }

  return null;
};
