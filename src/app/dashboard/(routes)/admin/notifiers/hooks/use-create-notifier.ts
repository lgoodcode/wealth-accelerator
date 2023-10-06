import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { addNotifierAtom } from '../atoms';
import type { Notifier } from '@/lib/types';

export const useCreateNotifier = () => {
  const addNotifier = useSetAtom(addNotifierAtom);

  return async (notifier: Omit<Notifier, 'id'>) => {
    const { error: insertError, data: newNotifier } = await supabase
      .from('notifiers')
      .insert({
        ...notifier,
        email: notifier.email.toLowerCase(),
      })
      .select('*')
      .single();

    if (insertError || !newNotifier) {
      throw insertError || new Error('Failed to insert notifier');
    }

    addNotifier(newNotifier);
  };
};
