import { useRouter, useSearchParams } from 'next/navigation';

import { supabase } from '@/lib/supabase/client';

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect_to');

  return async (data: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw error;
    }

    router.push(redirectTo || '/dashboard/home');
  };
};
