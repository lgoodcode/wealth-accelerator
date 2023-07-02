import { PlaidErrorType } from 'plaid';

import { PLAID_SYNC_BATCH_SIZE } from '@/config/app';
import { plaidClient } from '@/lib/plaid/config';
import { createSupabase } from '@/lib/supabase/server/createSupabase';
import { updateTransactions } from '@/lib/plaid/transactions/updateTransactions';
import { addTransactions } from '@/lib/plaid/transactions/addTransactions';
import { removeTransactions } from '@/lib/plaid/transactions/removeTransactions';
import { PlaidRateLimitErrorCode, PlaidCredentialErrorCode } from '@/lib/plaid/types/sync';
import type { Institution } from '@/lib/plaid/types/institutions';
import type { Filter } from '@/lib/plaid/types/transactions';
import type { ServerSyncTransactions } from '@/lib/plaid/types/sync';

export const serverSyncTransactions = async (
  item: Institution
): Promise<ServerSyncTransactions> => {
  const supabase = createSupabase();
  const { error: filtersError, data: filtersData } = await supabase
    .from('plaid_filters')
    .select('*');

  if (filtersError) {
    return {
      error: {
        status: 500,
        general: filtersError,
        plaid: null,
      },
      data: {
        hasMore: false,
      },
    };
  }

  const filters = filtersData as Filter[];

  try {
    const { data } = await plaidClient.transactionsSync({
      access_token: item.access_token,
      cursor: item.cursor ?? undefined, // Pass the current cursor, if any, to fetch transactions after that cursor
      count: PLAID_SYNC_BATCH_SIZE,
    });

    const addedError = await addTransactions(item.item_id, data.added, filters, supabase);
    const updatedError = await updateTransactions(item.item_id, data.modified, filters, supabase);
    const removedError = await removeTransactions(data.removed, supabase);

    if (addedError || updatedError || removedError) {
      return {
        error: {
          status: 500,
          general: addedError || updatedError || removedError,
          plaid: null,
        },
        data: {
          hasMore: false,
        },
      };
    }

    // Update the item's cursor
    const { error: cursorError } = await supabase
      .from('plaid')
      .update({ cursor: data.next_cursor })
      .eq('item_id', item.item_id);

    if (cursorError) {
      return {
        error: {
          status: 500,
          general: cursorError,
          plaid: null,
        },
        data: {
          hasMore: false,
        },
      };
    }

    return {
      error: null,
      data: {
        hasMore: data.has_more,
      },
    };
  } catch (err) {
    const error = err as any;
    const errorCode = error?.response?.data?.error_code;
    const isRateLimitError = errorCode === PlaidRateLimitErrorCode;
    const isCredentialError = errorCode in PlaidCredentialErrorCode;
    const isOtherPlaidError = errorCode in PlaidErrorType;
    const status = isRateLimitError ? 429 : 500;

    return {
      error: {
        status,
        general: null,
        plaid: {
          isRateLimitError,
          isCredentialError,
          isOtherPlaidError,
        },
      },
      data: {
        hasMore: false,
      },
    };
  }
};
