import { fetcher } from '@/lib/utils/fetcher';
import {
  SyncTransactionsResponseBody,
  type SyncTransactionsResponseError,
} from '@/lib/plaid/types/sync';

/**
 * For a given institution item_id, sync transactions. When it is the initial sync for
 * a new institution, the first request will return a hasMore value of false and the
 * webhook will handle the rest of the syncing. If it is not the initial sync, we will
 * continue to make requests until the hasMore value is false.
 *
 * This will return an error if the request fails or if the Plaid error is a credential
 * error. If the Plaid error is a rate limit error, it will wait a minute and continue
 * making requests.
 */
export const clientSyncTransactions = async (
  item_id: string
): Promise<SyncTransactionsResponseError | null> => {
  // Track the number of requests made to Plaid - rate limit is 50 per minute
  let numOfRequests = 0;

  while (true) {
    numOfRequests++;
    // Plaid limits the number of requests to 50 per minute, so if we hit that limit,
    // wait a minute before continuing
    if (numOfRequests === 50) {
      numOfRequests = 0;
      await new Promise((resolve) => setTimeout(resolve, 60000));
    }

    const { error, data } = await fetcher<
      SyncTransactionsResponseBody,
      SyncTransactionsResponseError
    >(`/api/plaid/institutions/sync/${item_id}?request_id=${Date.now()}`);

    if (error) {
      // If it's a rate limit error, wait a minute and continue
      if (error?.plaid?.isRateLimitError) {
        numOfRequests = 0;
        await new Promise((resolve) => setTimeout(resolve, 60000));
        continue;
      }

      return error;
    } else if (data?.hasMore) {
      continue;
    }

    return null;
  }
};
