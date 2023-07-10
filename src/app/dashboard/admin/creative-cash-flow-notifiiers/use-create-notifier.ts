import { supabase } from '@/lib/supabase/client';
import type { Notifier } from './types';

export const useCreateNotifier = () => {
  return async (notifier: Pick<Notifier, 'name' | 'email' | 'enabled'>) => {
    const { error: insertError, data: newNotifier } = await supabase
      .from('creative_cash_flow_notifiers')
      .insert({
        ...notifier,
        email: notifier.email.toLowerCase(),
      })
      .select('*')
      .single();

    if (insertError || !newNotifier) {
      throw insertError || new Error('Failed to insert notifier');
    }

    return newNotifier as Notifier;
  };
};
