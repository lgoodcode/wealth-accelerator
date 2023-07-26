import { supabase } from '@/lib/supabase/client';

export const usePasswordResetEmail = () => {
  return async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // redirectTo: `${location.origin}/api/auth/callback?redirect_to=/reset-password`,
      redirectTo: `https://staging.app.chirowealth.com/api/auth/callback?redirect_to=/reset-password`,
    });

    if (error) {
      throw error;
    }
  };
};
