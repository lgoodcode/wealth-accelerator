import { supabase } from '@/lib/supabase/client';

export const usePasswordResetEmail = () => {
  return async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // Need to redirect to the auth callback to exchange the code for the session
      // and then redirect to the reset password page with the session
      // so the user can reset their password
      redirectTo: `${location.origin}/api/auth/callback?redirect_to=/reset-password`,
    });

    if (error) {
      throw error;
    }
  };
};
