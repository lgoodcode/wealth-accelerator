import { useAtomValue } from 'jotai';

import { userAtom } from '@/lib/atoms/users';

export const useUser = () => {
  return useAtomValue(userAtom);
};
