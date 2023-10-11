import { supabase } from '@/lib/supabase/client';
import { useSetAtom } from 'jotai';
import { renameCcfRecordAtom } from '../atoms';

export const useRenameCcfRecord = () => {
  const renameCcfRecord = useSetAtom(renameCcfRecordAtom);

  return async (id: string, newName: string) => {
    const { error } = await supabase
      .from('creative_cash_flow')
      .update({
        name: newName,
      })
      .eq('id', id);

    if (error) {
      throw error;
    }

    renameCcfRecord(id, newName);
  };
};
