import { supabase } from '@/lib/supabase/client';

export const useDeleteNotifier = () => {
  return async (id: number) => {
    const { error } = await supabase.from('creative_cash_flow_notifiers').delete().eq('id', id);

    if (error) {
      throw error;
    }
  };
};
