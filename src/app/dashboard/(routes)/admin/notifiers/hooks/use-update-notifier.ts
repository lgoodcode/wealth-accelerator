import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { updateNotifierAtom } from '../atoms';
import type { NotifierForm } from '../schema';

export const useUpdateNotifier = () => {
  const updateNotifiers = useSetAtom(updateNotifierAtom);

  return async (id: number, data: NotifierForm) => {
    const { error, data: updatedNotifer } = await supabase
      .from('notifiers')
      .update({
        ...data,
        email: data.email.toLowerCase(),
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
