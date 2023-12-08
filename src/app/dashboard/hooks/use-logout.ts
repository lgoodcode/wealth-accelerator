import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { useQueryClient } from '@tanstack/react-query';
import { setUser as setSentryUser } from '@sentry/nextjs';

import { supabase } from '@/lib/supabase/client';
import { clearUserAtom } from '@/lib/atoms/user';

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearUser = useSetAtom(clearUserAtom);

  return async () => {
    clearUser();
    setSentryUser(null);
    await supabase.auth.signOut();
    queryClient.clear();
    router.refresh();
    router.push('/login');
  };
};
