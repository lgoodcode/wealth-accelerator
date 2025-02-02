import { supabase } from '@/lib/supabase/client';
import type { UpdateTransactionForm } from '../schema';
import type { TransactionWithAccountName } from '@/lib/plaid/types/transactions';

export const useUpdateTransaction = () => {
  return async (transaction_id: string, data: UpdateTransactionForm) => {
    const { error, data: updatedTransaction } = await supabase
      .from('plaid_transactions')
      .update({
        name: data.name,
        category: data.category,
        user_filter_id: null,
        global_filter_id: null,
      })
      .eq('id', transaction_id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return updatedTransaction as TransactionWithAccountName;
  };
};
