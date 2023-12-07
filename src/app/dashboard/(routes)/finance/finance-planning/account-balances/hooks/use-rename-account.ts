import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { initcap } from '@/lib/utils/initcap';
import { CustomError } from '@/lib/utils/CustomError';
import { updateAccountAtom } from '../atoms';
import type { BalancesAccount } from '@/lib/types/balances';

export const useRenameAccount = () => {
  const updateAccount = useSetAtom(updateAccountAtom);

  return async (account: BalancesAccount, name: string) => {
    const newName = initcap(name);
    const { error } = await supabase
      .from('balances_accounts')
      .update({ name: newName })
      .eq('id', account.id);

    if (error) {
      if (error.message.toLowerCase().includes('duplicate account name')) {
        throw new CustomError(error, 'DUPLICATE_ACCOUNT_NAME');
      }
      throw error;
    }

    updateAccount({
      ...account,
      name: newName,
    });

    return newName;
  };
};
