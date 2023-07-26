import { supabase } from '@/lib/supabase/client';

export const usePasswordResetEmail = () => {
  return async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/api/auth/callback`,
    });

    if (error) {
      throw error;
    }
  };
};
