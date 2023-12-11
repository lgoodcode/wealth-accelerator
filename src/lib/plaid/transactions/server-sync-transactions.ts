import { captureException, captureMessage } from '@sentry/nextjs';

import { plaidClient } from '@/lib/plaid/config';
import { supabaseAdmin } from '@/lib/supabase/server/admin';
import { updateTransactions } from '@/lib/plaid/transactions/update-transactions';
import { addTransactions } from '@/lib/plaid/transactions/add-transactions';
import { removeTransactions } from '@/lib/plaid/transactions/remove-transactions';
import {
  PlaidRateLimitErrorCode,
  PlaidCredentialErrorCode,
  PlaidTransactionsSyncMutationErrorCode,
} from '@/lib/plaid/types/sync';
import { createLinkToken } from '@/lib/plaid/create-link-token';
import type { Institution } from '@/lib/plaid/types/institutions';
import type { Filter, UserFilter } from '@/lib/plaid/types/transactions';
import type { ServerSyncTransactions } from '@/lib/plaid/types/sync';

/**
 * The number of transactions to retrieve per request. The maximum is 500.
 */
export const PLAID_SYNC_BATCH_SIZE = 500;

type GetFilters<F> =
  | {
      isError: true;
      data: ServerSyncTransactions;
    }
  | {
      isError: false;
      data: F[];
    };

const getGlobalFilters = async (): Promise<GetFilters<Filter>> => {
  const { error, data } = await supabaseAdmin // Need admin to access plaid_filters for all users
    .from('global_plaid_filters')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    return {
      isError: true,
      data: {
        error: {
          status: 500,
          general: error,
          plaid: null,
          link_token: null,
        },
        data: {
          hasMore: false,
          transactions: null,
        },
      } as ServerSyncTransactions,
    };
  }

  return {
    isError: false,
    data: data as Filter[],
  };
};

const getUserFilters = async (user_id: string): Promise<GetFilters<UserFilter>> => {
  const { error, data } = await supabaseAdmin // Need admin to access plaid_filters for all users
    .from('user_plaid_filters')
    .select('id, filter, category')
    .eq('user_id', user_id)
    .order('id', { ascending: true });

  if (error) {
    return {
      isError: true,
      data: {
        error: {
          status: 500,
          general: error,
          plaid: null,
          link_token: null,
        },
        data: {
          hasMore: false,
          transactions: null,
        },
      } as ServerSyncTransactions,
    };
  }

  return {
    isError: false,
    data: data as UserFilter[],
  };
};

/**
 * Performs the sync between Plaid. This handles the error logging.
 *
 * @param item
 * @returns data or custom error data
 */
export const serverSyncTransactions = async (
  item: Institution
): Promise<ServerSyncTransactions> => {
  const { isError: globalFiltersIsError, data: globalFilters } = await getGlobalFilters();

  if (globalFiltersIsError) {
    return globalFilters;
  }

  const { isError: userFiltersIsError, data: userFilters } = await getUserFilters(item.user_id);

  if (userFiltersIsError) {
    return userFilters;
  }

  try {
    const { data } = await plaidClient.transactionsSync({
      access_token: item.access_token,
      cursor: item.cursor ?? undefined, // Pass the current cursor, if any, to fetch transactions after that cursor
      count: PLAID_SYNC_BATCH_SIZE,
    });
    const addedError = await addTransactions(
      item.item_id,
      data.added,
      userFilters,
      globalFilters,
      supabaseAdmin
    );
    const updatedError = await updateTransactions(
      item.item_id,
      data.modified,
      userFilters,
      globalFilters,
      supabaseAdmin
    );
    const removedError = await removeTransactions(data.removed, supabaseAdmin);

    if (addedError || updatedError || removedError) {
      console.log({
        error: {
          status: 500,
          general: addedError || updatedError || removedError,
          plaid: null,
          link_token: null,
        },
      });
      return {
        error: {
          status: 500,
          general: addedError || updatedError || removedError,
          plaid: null,
          link_token: null,
        },
        data: {
          hasMore: false,
          transactions: {
            added: data.added.length,
            modified: data.modified.length,
            removed: data.removed.length,
          },
        },
      };
    }

    // Update the item's cursor
    const { error: cursorError } = await supabaseAdmin
      .from('plaid')
      .update({ cursor: data.next_cursor })
      .eq('item_id', item.item_id);

    if (cursorError) {
      return {
        error: {
          status: 500,
          general: cursorError,
          plaid: null,
          link_token: null,
        },
        data: {
          hasMore: false,
          transactions: null,
        },
      };
    }

    return {
      error: null,
      data: {
        // If it's the first sync, has_more will be false, so we need to set it to true
        // so that the client will continue to make requests until has_more is false
        // only if the account actually has transaction data
        hasMore:
          Boolean(item.cursor) && (!!data.added.length || !!data.modified.length)
            ? true
            : data.has_more,
        transactions: null,
      },
    };
  } catch (error: any) {
    console.log('caught');
    const errorCode = error?.response?.data?.error_code as string;
    const isRateLimitError = errorCode === PlaidRateLimitErrorCode;
    const isSyncMutationError = errorCode === PlaidTransactionsSyncMutationErrorCode;
    const isCredentialError = Object.values(PlaidCredentialErrorCode).includes(errorCode as any);
    let generalError = !errorCode ? error : null;
    let status = isRateLimitError ? 429 : 500;
    let link_token = null;
    let resetCursor = false;

    // Take the access token and use it to request a new link token from Plaid for update mode
    if (isCredentialError && item.user_id) {
      try {
        link_token = await createLinkToken(item.user_id, item.access_token);
      } catch (error) {
        generalError = error;
        status = 500;
      }
      // If it's a sync mutation error, then we need to reset the cursor and try again
    } else if (isSyncMutationError) {
      const { error: cursorError } = await supabaseAdmin
        .from('plaid')
        .update({ cursor: null })
        .eq('item_id', item.item_id);

      if (cursorError) {
        generalError = cursorError;
        status = 500;
      } else {
        resetCursor = true;
      }
    }

    const result = {
      error: {
        status,
        general: generalError,
        link_token,
        plaid: {
          isRateLimitError,
          isCredentialError,
          isSyncMutationError,
          isOtherPlaidError: !generalError && !errorCode,
        },
      },
      data: {
        hasMore: isSyncMutationError && resetCursor ? true : false,
        transactions: null,
      },
    };

    console.log('result', result);

    console.error(result);

    if (result.error.plaid && result.error.plaid.isCredentialError) {
      captureMessage('Credentials error', {
        extra: {
          item_id: item.item_id,
          error: result.error,
        },
      });
    } else {
      console.log('captureException');
      captureException('Failed to sync transactions', {
        extra: {
          item_id: item.item_id,
          error: result.error,
        },
      });
    }

    return result;
  }
};
