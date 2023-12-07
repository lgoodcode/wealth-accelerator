import { supabase } from '@/lib/supabase/client';
import { initcap } from '@/lib/utils/initcap';
import type { UpdateAccountForm } from '../schema';
import type { Account } from '@/lib/plaid/types/institutions';
import { CustomError } from '@/lib/utils/CustomError';

export const useUpdateAccount = () => {
  return async (account_id: string, data: UpdateAccountForm) => {
    const { error, data: updatedAccount } = await supabase
      .from('plaid_accounts')
      .update({
        name: initcap(data.name, false),
        type: data.type,
        enabled: data.enabled,
      })
      .eq('account_id', account_id)
      .select('*')
      .single();

    if (error) {
      if (error.message.toLowerCase().includes('duplicate account name')) {
        throw new CustomError(error, 'DUPLICATE_ACCOUNT_NAME');
      }
      throw error;
    }

    return updatedAccount as Account;
  };
};
