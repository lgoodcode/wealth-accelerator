import { supabase } from '@/lib/supabase/client';
import type { NotifierFormType } from './schema';
import type { Notifier } from './types';

export const useUpdateNotifier = () => {
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

    return updatedNotifer as Notifier;
  };
};
