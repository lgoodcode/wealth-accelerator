import { supabase } from '@/lib/supabase/client';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';
import type { RenameFormType } from './schemas';

export const useRenameInstitution = () => {
  return async (institution: ClientInstitution, data: RenameFormType) => {
    const { error } = await supabase
      .from('plaid')
      .update({ name: data.name })
      .eq('item_id', institution.item_id);

    if (error) {
      throw error;
    }
  };
};
