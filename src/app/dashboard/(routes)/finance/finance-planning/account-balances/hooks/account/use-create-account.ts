import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { CustomError } from '@/lib/utils/CustomError';
import { initcap } from '@/lib/utils/initcap';
import { useUser } from '@/hooks/use-user';
import { addAccountAtom } from '../../atoms';

export const useCreateAccount = () => {
  const user = useUser();
  const addAccount = useSetAtom(addAccountAtom);

  return async (name: string): Promise<string> => {
    const { error, data: newAccount } = await supabase
      .from('balances_accounts')
      .insert({
        name: initcap(name),
        user_id: user!.id,
      })
      .select('*')
      .single();

    if (error) {
      if (error.message.toLowerCase().includes('duplicate account name')) {
        throw new CustomError(error, 'DUPLICATE_ACCOUNT_NAME');
      }
      throw error;
    }

    addAccount(newAccount);

    return newAccount.name;
  };
};
