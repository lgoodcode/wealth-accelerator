import { supabase } from '@/lib/supabase/client';
import type { UpdateFilterFormType } from './schemas';

export const useUpdateFilter = () => {
  return async (id: number, data: UpdateFilterFormType) => {
    const { error } = await supabase
      .from('plaid_filters')
      .update({ category: data.category })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }
  };
};
