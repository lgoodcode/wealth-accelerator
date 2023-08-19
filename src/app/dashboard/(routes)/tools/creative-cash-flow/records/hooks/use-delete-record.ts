import { supabase } from '@/lib/supabase/client';
import { useSetAtom } from 'jotai';
import { removeCreativeCashFlowRecordAtom } from '../../atoms';

export const useDeleteRecord = () => {
  const removeRecord = useSetAtom(removeCreativeCashFlowRecordAtom);

  return async (id: number) => {
    const { error } = await supabase.from('creative_cash_flow').delete().eq('id', id);

    if (error) {
      throw error;
    }

    removeRecord(id);
  };
};
