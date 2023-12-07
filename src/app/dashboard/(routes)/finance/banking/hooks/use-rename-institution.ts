import { useSetAtom } from 'jotai';

import { supabase } from '@/lib/supabase/client';
import { initcap } from '@/lib/utils/initcap';
import { updateInstitutionsAtom } from '@/lib/plaid/atoms';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';
import type { RenameForm } from '../schema';

export const useRenameInstitution = () => {
  const updateInstitutions = useSetAtom(updateInstitutionsAtom);

  return async (institution: ClientInstitution, data: RenameForm) => {
    const newName = initcap(data.name, false);
    const { error } = await supabase
      .from('plaid')
      .update({ name: newName })
      .eq('item_id', institution.item_id);

    if (error) {
      throw error;
    }

    updateInstitutions({
      ...institution,
      name: newName,
    });

    return newName;
  };
};
