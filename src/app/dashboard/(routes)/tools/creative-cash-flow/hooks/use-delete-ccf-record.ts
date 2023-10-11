import { supabase } from '@/lib/supabase/client';
import { useSetAtom } from 'jotai';
import { removeCcfRecordAtom } from '../atoms';

export const useDeleteCcfRecord = () => {
  const removeCcfRecord = useSetAtom(removeCcfRecordAtom);

  return async (id: string, isShared: boolean) => {
    const { error } = await supabase.from('creative_cash_flow').delete().eq('id', id);

    if (error) {
      throw error;
    }

    // Only remove from local state if it's not a shared record
    if (!isShared) {
      removeCcfRecord(id);
    }
  };
};
