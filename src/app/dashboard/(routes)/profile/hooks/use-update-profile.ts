import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { updateUserNameAndEmailAtom } from '@/lib/atoms/user';
import type { ProfileFormType } from '@/lib/user-schema';

export const useUpdateProfile = () => {
  const updateGlobalUser = useSetAtom(updateUserNameAndEmailAtom);

  /**
   * Takes the returned data from the database, which ensures that the email is lowercase
   * and properly capitalizes the name to update the global user atom and return it to
   * be update the form.
   */
  return async (data: ProfileFormType) => {
    const { error, data: _profile } = await supabase.rpc('update_user_profile', {
      new_name: data.name,
      new_email: data.email.toLowerCase(),
    });

    if (error) {
      throw error;
    }

    const profile = _profile as {
      name: string;
      email: string;
    };

    updateGlobalUser(profile);

    return profile;
  };
};
