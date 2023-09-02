import { supabase } from '@/lib/supabase/client';
import { Role } from '@/lib/types';
import type { RegisterUserFormType } from '@/lib/user-schema';

export const useSignUp = () => {
  return async (data: RegisterUserFormType) => {
    const { error } = await supabase.auth.signUp({
      email: data.email.toLowerCase(),
      password: data.password,
      options: {
        data: {
          name: data.name,
          role: Role.USER,
        },
        emailRedirectTo: `${location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }
  };
};
