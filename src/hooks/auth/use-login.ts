import { useRouter, useSearchParams } from 'next/navigation';

import { supabase } from '@/lib/supabase/client';
import { formatPath } from '@/lib/utils/formatPath';

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Get all search parameters
  const allSearchParams = Object.fromEntries(searchParams.entries());
  // Remove redirect_to if it exists
  const redirectTo: `/${string}` = formatPath(allSearchParams.redirect_to);
  delete allSearchParams.redirect_to;

  const finalRedirectTo = `${redirectTo}?${new URLSearchParams(allSearchParams).toString()}`;

  return async (data: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw error;
    }

    router.push(finalRedirectTo || '/dashboard/home');
  };
};
