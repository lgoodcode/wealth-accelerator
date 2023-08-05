import { fetcher } from '@/lib/utils/fetcher';

import type { CreateLinkTokenResponse } from '@/lib/plaid/types/link-token';

export const createLinkToken = async () => {
  const { error, data } = await fetcher<CreateLinkTokenResponse>('/api/plaid/link-token/create');
  console.log('createlnktoken', { error, data });
  if (error || !data) {
    throw error || new Error('No data returned from /api/plaid/link-token/create');
  }

  return data.link_token;
};
