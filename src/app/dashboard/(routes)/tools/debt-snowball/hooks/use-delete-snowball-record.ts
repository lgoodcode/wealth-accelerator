import { supabase } from '@/lib/supabase/client';
import { useSetAtom } from 'jotai';
import { removeDebtSnowballRecordAtom } from '../atoms';

export const useDeleteSnowballRecord = () => {
  const removeSnowballRecord = useSetAtom(removeDebtSnowballRecordAtom);

  return async (id: string, isShared: boolean) => {
    const { error } = await supabase.from('debt_snowball').delete().eq('id', id);

    if (error) {
      throw error;
    }

    // Only remove from local state if it's not a shared record
    if (!isShared) {
      removeSnowballRecord(id);
    }
  };
};
