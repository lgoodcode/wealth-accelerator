import { useAtomValue } from 'jotai';

import { userAtom } from '@/lib/atoms/user';

export const useUser = () => {
  const user = useAtomValue(userAtom);
  return user;
};
