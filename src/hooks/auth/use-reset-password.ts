import { supabase } from '@/lib/supabase/client';

export const useResetPassword = () => {
  return async (hash: string, password: string) => {
    const params = new URLSearchParams(hash);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (!access_token) {
      throw new Error('Missing access token');
    } else if (!refresh_token) {
      throw new Error('Missing refresh token');
    }

    const { error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (sessionError) {
      throw sessionError;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw error;
    }
  };
};
