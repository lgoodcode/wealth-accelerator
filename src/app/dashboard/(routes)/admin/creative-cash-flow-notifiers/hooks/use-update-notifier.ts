import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { updateNotifierAtom } from '../atoms';
import type { NotifierFormType } from '../schema';

export const useUpdateNotifier = () => {
  const updateNotifiers = useSetAtom(updateNotifierAtom);

  return async (id: number, data: NotifierFormType) => {
    const { error, data: updatedNotifer } = await supabase
      .from('creative_cash_flow_notifiers')
      .update({
        name: data.name,
        email: data.email.toLowerCase(),
        enabled: data.enabled,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    updateNotifiers(updatedNotifer);
  };
};
