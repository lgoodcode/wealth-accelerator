import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { updateUserAtom } from '../atoms';
import { updateUserAtom as updateGlobalUserAtom } from '@/lib/atoms';
import type { UpdateUserFormType } from '@/lib/user-schema';

export const useUpdateUser = () => {
  const updateUser = useSetAtom(updateUserAtom);
  const updateGlobalUser = useSetAtom(updateGlobalUserAtom);

  return async (id: string, data: UpdateUserFormType, isCurrentUser: boolean) => {
    const { error, data: user } = await supabase
      .from('users')
      .update({ ...data })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    updateUser(user);

    if (isCurrentUser) {
      updateGlobalUser(user);
    }
  };
};
