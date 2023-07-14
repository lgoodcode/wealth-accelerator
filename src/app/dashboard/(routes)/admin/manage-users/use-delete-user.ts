import { useSetAtom } from 'jotai';

import { fetcher } from '@/lib/utils/fetcher';
import { removeUserAtom } from './atoms';

export const useDeleteUser = () => {
  const removeUser = useSetAtom(removeUserAtom);

  return async (id: string) => {
    const { error } = await fetcher(`/api/auth/users?id=${id}`, {
      method: 'DELETE',
    });

    if (error) {
      throw error;
    }

    removeUser(id);
  };
};
