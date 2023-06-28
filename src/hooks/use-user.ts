import { useAtomValue } from 'jotai';

import { userAtom } from '@/lib/atoms';

export const useUser = () => {
  return useAtomValue(userAtom);
};
