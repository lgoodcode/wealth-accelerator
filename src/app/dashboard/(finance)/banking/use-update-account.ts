import { supabase } from '@/lib/supabase/client';
import type { UpdateAccountType } from './schemas';
import type { Account } from '@/lib/plaid/types/institutions';

export const useUpdateAccount = () => {
  return async (account_id: string, data: UpdateAccountType) => {
    const { error, data: updatedAccount } = await supabase
      .from('plaid_accounts')
      .update({
        name: data.name,
        type: data.type,
        enabled: data.enabled,
      })
      .eq('account_id', account_id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return updatedAccount as Account;
  };
};
