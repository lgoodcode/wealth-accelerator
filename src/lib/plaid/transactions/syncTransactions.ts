import { fetcher } from '@/lib/utils/fetcher';
import { PlaidCredentialErrorCode, SyncResponse } from '@/lib/plaid/types/sync';

/**
 * For a given institution item_id, sync transactions
 */
export const syncTransactions = async (item_id: string) => {
  // Track the number of requests made to Plaid - rate limit is 50 per minute
  let numOfRequests = 0;

  while (true) {
    // Wait 5 seconds between requests
    await new Promise((resolve) => setTimeout(resolve, 5000));

    numOfRequests++;
    // Plaid limits the number of requests to 50 per minute, so if we hit that limit,
    // wait a minute before continuing
    if (numOfRequests === 50) {
      numOfRequests = 0;
      await new Promise((resolve) => setTimeout(resolve, 60000));
    }

    const { error, data } = await fetcher<SyncResponse>(
      `/api/plaid/institutions/sync/${item_id}?request_id=${Date.now()}`
    );

    // If it's a generic failure, return the error
    if (error || !data || data.plaidError?.isOtherPlaidError) {
      return new Error(error || `No data returned for /api/plaid/institutions/sync/${item_id}`);
      // If it's a non generic plaid error
    }

    console.log('response', { error, data });
    // Check if the response gives a Plaid error code
    if (data.plaidError) {
      // If it's a transactions sync limit error, wait a minute and continue
      if (data.plaidError.isRateLimitError) {
        numOfRequests = 0;
        await new Promise((resolve) => setTimeout(resolve, 60000));
        continue;
      } else if (data.plaidError.isCredentialError) {
        return PlaidCredentialErrorCode;
      }
    } else if (data.hasMore) {
      continue;
    }

    return null;
  }
};
