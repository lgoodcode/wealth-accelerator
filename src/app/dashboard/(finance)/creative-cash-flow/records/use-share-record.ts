import { fetcher } from '@/lib/utils/fetcher';

export const useShareRecord = () => {
  return async (record_id: string) => {
    const { error } = await fetcher(`/api/creative-cash-flow/share/${record_id}`);

    if (error && error.message !== 'No notifiers found') {
      throw error;
    }
  };
};
