import { supabase } from '@/lib/supabase/client';
import type { UpdateNotifiersType } from './schema';
import type { Notifier } from './types';

export const useUpdateNotifier = () => {
  return async (id: number, data: UpdateNotifiersType) => {
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
