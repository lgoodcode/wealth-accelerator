import { supabase } from '@/lib/supabase/client';
import { useSetAtom } from 'jotai';
import { removeDebtSnowballRecordAtom } from '../atoms';

export const useDeleteSnowballRecord = () => {
  const removeSnowballRecord = useSetAtom(removeDebtSnowballRecordAtom);

  return async (id: string) => {
    const { error } = await supabase.from('debt_snowball').delete().eq('id', id);

    if (error) {
      throw error;
    }

    removeSnowballRecord(id);
  };
};
