import { fetcher } from '@/lib/utils/fetcher';

export const useShareRecord = () => {
  return async (record_id: string) => {
    const { error } = await fetcher('/api/share/creative-cash-flow', {
      method: 'POST',
      body: JSON.stringify({ record_id }),
    });

    if (error) {
      throw error;
    }
  };
};
