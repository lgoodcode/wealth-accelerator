import { useAtomValue } from 'jotai';

import { userAtom } from '@/lib/plaid/atoms/users';

export const useUser = () => {
  return useAtomValue(userAtom);
};
