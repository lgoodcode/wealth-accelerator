import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { setUser as setSentryUser } from '@sentry/nextjs';

import { supabase } from '@/lib/supabase/client';

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return async () => {
    setSentryUser(null);
    await supabase.auth.signOut();
    queryClient.clear();
    router.refresh();
    router.push('/login');
  };
};
