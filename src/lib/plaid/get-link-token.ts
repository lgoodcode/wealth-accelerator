import { fetcher } from '@/lib/utils/fetcher';

import type { CreateLinkTokenResponse } from '@/lib/plaid/types/link-token';

export const getLinkToken = async (item_id?: string) => {
  const { error, data } = await fetcher<CreateLinkTokenResponse>(
    `/api/plaid/link-token/create${item_id ? `?item_id=${item_id}` : ''}`
  );

  if (error || !data) {
    throw error || new Error('No data returned from /api/plaid/link-token/create');
  }

  return data.link_token;
};
