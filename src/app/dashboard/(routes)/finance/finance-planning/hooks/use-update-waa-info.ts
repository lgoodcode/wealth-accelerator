import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { updateWaaInfoAtom } from '../atoms';
import type { WaaInfoSchema } from '../schema';

export const useUpdateWaaInfo = () => {
  const router = useRouter();
  const updateDebt = useSetAtom(updateWaaInfoAtom);

  return async (id: number, data: WaaInfoSchema) => {
    const { error, data: updatedWaaInfo } = await supabase
      .from('waa')
      .update({
        ...data,
        date: data.date.toUTCString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    updateDebt(updatedWaaInfo);
    router.refresh();
  };
};
