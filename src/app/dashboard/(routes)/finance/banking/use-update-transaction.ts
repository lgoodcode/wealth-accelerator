import { supabase } from '@/lib/supabase/client';
import type { UpdateTransactionType } from './schemas';
import type { TransactionWithAccountName } from '@/lib/plaid/types/transactions';

export const useUpdateTransaction = () => {
  return async (transaction_id: string, data: UpdateTransactionType) => {
    const { error, data: updatedTransaction } = await supabase
      .from('plaid_transactions')
      .update({
        name: data.name,
        category: data.category,
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
