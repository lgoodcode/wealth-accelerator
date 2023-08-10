import { useSetAtom } from 'jotai';

import { fetcher } from '@/lib/utils/fetcher';
import { addUserAtom } from '@/lib/atoms/users';
import type { InviteUserFormType } from '../schema';

export const useInviteUser = () => {
  const addUser = useSetAtom(addUserAtom);

  return async (data: InviteUserFormType) => {
    const {
      error,
      data: { user },
    } = await fetcher('/api/auth/users/invite', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (error) {
      throw error;
    }

    addUser(user);
  };
};
