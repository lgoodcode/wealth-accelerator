import { supabase } from '@/lib/supabase/client';
import type { RegisterUserFormType } from '@/lib/user-schema';

export const useSignUp = () => {
  return async (data: RegisterUserFormType) => {
    const { error } = await supabase.auth.signUp({
      email: data.email.toLowerCase(),
      password: data.password,
      options: {
        data: { name: data.name },
        emailRedirectTo: `${location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }
  };
};
