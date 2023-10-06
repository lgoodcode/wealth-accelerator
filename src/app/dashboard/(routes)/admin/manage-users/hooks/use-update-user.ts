import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { updateUserAtom } from '@/lib/atoms/users';
import { updateUserAtom as updateGlobalUserAtom } from '@/lib/atoms/user';
import type { UpdateUserForm } from '@/lib/user-schema';

export const useUpdateUser = () => {
  const updateUser = useSetAtom(updateUserAtom);
  const updateGlobalUser = useSetAtom(updateGlobalUserAtom);

  return async (id: string, data: UpdateUserForm, isCurrentUser: boolean) => {
    const { error, data: user } = await supabase
      .from('users')
      .update({ ...data })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    // If the user exists in the public.users table, then the email is confirmed so we can
    // can manually set the ManageUser confirmed_email to true
    updateUser({
      ...user,
      confirmed_email: true,
    });

    if (isCurrentUser) {
      updateGlobalUser(user);
    }
  };
};
