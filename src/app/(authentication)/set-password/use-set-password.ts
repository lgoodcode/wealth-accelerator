import { supabase } from '@/lib/supabase/client';

export const useSetPassword = () => {
  return async (password: string) => {
    const items = window.location.hash.substr(1).split('&');
    const access_token = items?.[0].split('=')[1];
    const refresh_token = items?.[2].split('=')[1];

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

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      throw error;
    }
  };
};
