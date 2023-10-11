import { fetcher } from '@/lib/utils/fetcher';

export const useShareSnowballRecord = () => {
  return async (record_id: string) => {
    const { error } = await fetcher('/api/share/debt-snowball', {
      method: 'POST',
      body: JSON.stringify({ record_id }),
    });

    if (error) {
      throw error;
    }
  };
};
