import { useSetAtom } from 'jotai';

import { fetcher } from '@/lib/utils/fetcher';
import { removeInstitutionAtom } from '@/lib/plaid/atoms';

export const useDeleteInstitution = () => {
  const removeInstitution = useSetAtom(removeInstitutionAtom);

  return async (item_id: string) => {
    const { error } = await fetcher(`/api/plaid/institutions/remove/${item_id}`, {
      method: 'DELETE',
    });

    if (error) {
      throw error;
    }

    removeInstitution(item_id);
  };
};
