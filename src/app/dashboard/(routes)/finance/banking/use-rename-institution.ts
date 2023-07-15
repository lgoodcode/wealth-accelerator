import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { updateInstitutionsAtom } from '@/lib/plaid/atoms';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';
import type { RenameFormType } from './schemas';

export const useRenameInstitution = () => {
  const updateInstitutions = useSetAtom(updateInstitutionsAtom);

  return async (institution: ClientInstitution, data: RenameFormType) => {
    const { error } = await supabase
      .from('plaid')
      .update({ name: data.name })
      .eq('item_id', institution.item_id);

    if (error) {
      throw error;
    }

    updateInstitutions({
      ...institution,
      name: data.name,
    });
  };
};
