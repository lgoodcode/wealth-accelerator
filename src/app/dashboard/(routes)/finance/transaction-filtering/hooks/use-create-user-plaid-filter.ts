import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';
import { addUserFilterAtom } from '../atoms';
import type { UserFilter } from '@/lib/plaid/types/transactions';
import type { CreateUserFilterFormType } from '../schema';

export const useCreateUserPlaidFilter = () => {
  const user = useUser()!;
  const addUserFilter = useSetAtom(addUserFilterAtom);

  return async (data: CreateUserFilterFormType) => {
    const { error, data: userFilter } = await supabase
      .rpc('create_user_plaid_filter', {
        _filter: {
          user_id: user.id,
          filter: data.filter,
          category: data.category,
        },
        user_override: data.user_override ?? false,
        global_override: data.global_override ?? false,
      })
      .select('*')
      .single();

    if (error || !userFilter) {
      throw error || new Error('Could not create filter');
    }

    addUserFilter(userFilter as UserFilter);
  };
};
