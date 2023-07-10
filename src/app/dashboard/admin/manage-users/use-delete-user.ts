import { supabase } from '@/lib/supabase/client';

export const useDeleteUser = () => {
  return async (id: number) => {
    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
      throw error;
    }
  };
};
