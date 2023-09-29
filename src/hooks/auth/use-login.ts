import { useRouter, useSearchParams } from 'next/navigation';

import { supabase } from '@/lib/supabase/client';
import { formatPath } from '@/lib/utils/format-path';

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const redirectTo = formatPath(searchParams.get('redirect_to'));
  let queryString = '?';
  let i = 0;

  for (const [key, value] of searchParams.entries()) {
    if (key !== 'redirect_to') {
      queryString += `${key}=${value}`;
      i++;
    }

    if (i > 1) {
      queryString += '&';
    }
  }

  queryString = queryString === '?' ? '' : queryString;
  const redirectUrl = redirectTo ? `${redirectTo}${queryString}` : '/dashboard/home';

  return async (data: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw error;
    }

    router.push(redirectUrl);
  };
};
