import { useSetAtom } from 'jotai';

import { fetcher } from '@/lib/utils/fetcher';
import { addUserAtom } from '@/lib/atoms/users';
import type { InviteUserFormType } from '../schema';

export const useInviteUser = () => {
  const addUser = useSetAtom(addUserAtom);

  return async (inviteUser: InviteUserFormType) => {
    const { error, data } = await fetcher('/api/auth/users/invite', {
      method: 'POST',
      body: JSON.stringify(inviteUser),
    });

    if (error) {
      throw error;
    }

    addUser(data.user);
  };
};
