import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { removeWaaInfoAtom } from '../atoms';

export const useDeleteWaaInfo = () => {
  const router = useRouter();
  const removeWaaInfo = useSetAtom(removeWaaInfoAtom);

  return async (id: number) => {
    const { error } = await supabase.from('waa').delete().eq('id', id);

    if (error) {
      throw error;
    }

    removeWaaInfo(id);
    router.refresh();
  };
};
