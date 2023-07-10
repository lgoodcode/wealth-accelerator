import { supabase } from '@/lib/supabase/client';

export const useDeleteFilter = () => {
  return async (id: number) => {
    const { error } = await supabase.from('plaid_filters').delete().eq('id', id);

    if (error) {
      throw error;
    }
  };
};
