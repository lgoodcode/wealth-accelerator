import { fetcher } from '@/lib/utils/fetcher';

export const useDeleteInstitution = () => {
  return async (item_id: string) => {
    const { error } = await fetcher(`/api/plaid/institutions/remove/${item_id}`, {
      method: 'DELETE',
    });

    throw error;
  };
};
