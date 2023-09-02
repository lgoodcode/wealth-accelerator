import { supabase } from '@/lib/supabase/client';

/**
 * The inviteUser from Supabase doesn't support the PKCE flow, which is what the
 * helpers use, and instead uses the Implicit flow, which places the access_token
 * and such in the URL hash, so we need that to verify the user before setting
 * their password for the first time.
 */
export const useSetPassword = () => {
  return async (password: string) => {
    const items = window.location.hash.substring(1).split('&');
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
