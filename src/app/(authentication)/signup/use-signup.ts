import { supabase } from '@/lib/supabase/client';
import type { FormType } from './register-form';

export const useSignUp = () => {
  return async (data: FormType) => {
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
