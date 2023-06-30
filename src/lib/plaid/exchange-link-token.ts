import { fetcher } from '../utils/fetcher';
import type { ExchangeLinkTokenBody, ExchangeLinkTokenResponse } from './types/link-token';

export const exchangeLinkToken = async ({ public_token, metadata }: ExchangeLinkTokenBody) => {
  const { error, data } = await fetcher<ExchangeLinkTokenResponse>(
    '/api/plaid/link-token/exchange',
    {
      method: 'POST',
      body: JSON.stringify({ public_token, metadata }),
    }
  );

  if (error || !data) {
    throw error || new Error('No data returned from /api/plaid/link-token/exchange');
  }

  return data;
};
