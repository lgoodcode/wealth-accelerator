import { supabase } from '@/lib/supabase/client';

export const useUpdatePassword = () => {
  return async (current_password: string, new_password: string) => {
    const { error } = await supabase.rpc('change_user_password', {
      current_password,
      new_password,
    });

    if (error) {
      throw error;
    }
  };
};
