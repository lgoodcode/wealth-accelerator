import { supabase } from '@/lib/supabase/client';
import { useSetAtom } from 'jotai';
import { renameDebtSnowballRecordAtom } from '../atoms';

export const useRenameSnowballRecord = () => {
  const renameSnowballRecord = useSetAtom(renameDebtSnowballRecordAtom);

  return async (id: string, newName: string) => {
    const { error } = await supabase
      .from('debt_snowball')
      .update({
        name: newName,
      })
      .eq('id', id);

    if (error) {
      throw error;
    }

    renameSnowballRecord(id, newName);
  };
};
