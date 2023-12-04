import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';

import { useUser } from '@/hooks/use-user';
import { supabase } from '@/lib/supabase/client';
import { addWaaInfoAtom } from '../atoms';
import type { WaaInfoSchema } from '../schema';

export const useCreateWaaInfo = () => {
  const user = useUser();
  const router = useRouter();
  const addWaaInfo = useSetAtom(addWaaInfoAtom);

  return async (waaInfo: WaaInfoSchema) => {
    if (!user) {
      throw new Error('User is not authenticated');
    }

    const { error: insertError, data: newWaaInfo } = await supabase
      .from('waa')
      .insert({
        date: waaInfo.date.toUTCString(),
        amount: waaInfo.amount,
        user_id: user.id,
      })
      .select('*')
      .single();

    if (insertError || !newWaaInfo) {
      throw insertError || new Error('Failed to insert waaInfo');
    }

    addWaaInfo(structuredClone(newWaaInfo));
    router.refresh();
  };
};
