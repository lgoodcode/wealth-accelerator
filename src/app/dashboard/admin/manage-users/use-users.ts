import { useQuery } from '@tanstack/react-query';

import { fetcher } from '@/lib/utils/fetcher';

const CACHE_USERS_FOR = 1000 * 60 * 60 * 24; // 1 day

const getUsers = async () => {
  const { error, data } = await fetcher<{ users: User[] }>('/api/auth/users', {
    credentials: 'omit',
  });

  if (error) {
    console.error(error);
  }

  if (data && data.users) {
    return data.users;
  }

  return [];
};

export const useUsers = () => {
  const {
    isError,
    isLoading,
    data: users,
  } = useQuery<User[]>(['users'], () => getUsers(), {
    staleTime: CACHE_USERS_FOR,
  });

  return {
    isError,
    isLoading,
    users,
  };
};
