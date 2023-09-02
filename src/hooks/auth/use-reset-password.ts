import { supabase } from '@/lib/supabase/client';

export const useResetPassword = () => {
  return async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw error;
    }
  };
};
