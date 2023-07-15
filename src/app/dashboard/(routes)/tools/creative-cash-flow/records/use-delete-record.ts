import { supabase } from '@/lib/supabase/client';
import { useSetAtom } from 'jotai';
import { removeCreativeCashFlowRecordAtom } from '../atoms';

export const useDeleteRecord = () => {
  const removeRecord = useSetAtom(removeCreativeCashFlowRecordAtom);

  return async (id: string) => {
    const { error } = await supabase.rpc('delete_creative_cash_flow_record', {
      record_id: id,
    });

    if (error) {
      throw error;
    }

    removeRecord(id);
  };
};
