import { useAtomValue } from 'jotai';

import { userAtom } from '@/lib/atoms/user';

export const useUser = () => {
  return useAtomValue(userAtom);
};
