import { supabase } from '@/lib/supabase/client';
import { CreateUserFormType } from '@/lib/userSchema';

export const useUpdateUser = () => {
  return async (newUser: CreateUserFormType, confirmEmail: boolean) => {
    // const {error} = await supabase.auth.admin.createUser({
    //   email: newUser.email,
    //   password: newUser.password,
    //   options: {
    //     data: {
    //       name: newUser.name,
    //     },
    //   },
  };
};
