import { supabase } from '@/lib/supabase/client';

export const useDeleteRecord = () => async (id: string) => {
  const { error } = await supabase.rpc('delete_creative_cash_flow_record', {
    record_id: id,
  });

  if (error) {
    throw error;
  }
};
