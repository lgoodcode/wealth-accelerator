import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';
import { PlaidErrorType } from 'plaid';

import { PLAID_SYNC_BATCH_SIZE } from '@/config/app';
import { getUser } from '@/lib/supabase/server/getUser';
import { createSupabase } from '@/lib/supabase/server/createSupabase';
import { plaidClient } from '@/lib/plaid/config';
import { getItemFromItemId } from '@/lib/plaid/getItemFromItemId';
import { updateTransactions } from '@/lib/plaid/transactions/updateTransactions';
import { Filter } from '@/lib/plaid/types/transactions';
import { addTransactions } from '@/lib/plaid/transactions/addTransactions';
import { removeTransactions } from '@/lib/plaid/transactions/removeTransactions';
import {
  PlaidRateLimitErrorCode,
  PlaidCredentialErrorCode,
  type SyncResponse,
} from '@/lib/plaid/types/sync';

interface SyncInstitutionParams {
  params: {
    item_id: string;
  };
}

export async function GET(_: Request, { params: { item_id } }: SyncInstitutionParams) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'No user found' }, { status: 401 });
  }

  // Verify the parameters
  if (!item_id) {
    return NextResponse.json({ error: 'Missing item_id' }, { status: 400 });
  }

  const { error: itemError, data: item } = await getItemFromItemId(item_id);

  if (itemError) {
    console.error(itemError);
    captureException(itemError);
    return NextResponse.json({ error: 'Failed to retrieve item' }, { status: 500 });
  }

  const supabase = createSupabase();
  // Get the filters for parsing the transactions
  const { error, data } = await supabase.from('plaid_filters').select('*');

  if (error) {
    console.error(error);
    captureException(error);
    return NextResponse.json({ error: 'Failed to retrieve filters' }, { status: 500 });
  }

  const filters = data as Filter[];

  // Fetch transactions from Plaid
  try {
    const { data } = await plaidClient.transactionsSync({
      access_token: item.access_token,
      cursor: item.cursor ?? undefined, // Pass the current cursor, if any, to fetch transactions after that cursor
      count: PLAID_SYNC_BATCH_SIZE,
    });

    console.log('response', { data });

    const addedError = await addTransactions(item_id, data.added, filters, supabase);
    const updatedError = await updateTransactions(item_id, data.modified, filters, supabase);
    const removedError = await removeTransactions(data.removed, supabase);

    if (addedError || updatedError || removedError) {
      const error = addedError ?? updatedError ?? removedError;
      console.error(error);
      captureException(error);
      return NextResponse.json({ error: 'Failed to update transactions' }, { status: 500 });
    }

    // Update the item's cursor
    const { error: cursorError } = await supabase
      .from('plaid')
      .update({ cursor: data.next_cursor })
      .eq('item_id', item_id);

    if (cursorError) {
      console.error(cursorError);
      captureException(cursorError);
      return NextResponse.json({ error: 'Failed to update cursor' }, { status: 500 });
    }

    return NextResponse.json<SyncResponse>({ hasMore: data.has_more });
  } catch (err) {
    const error = err as any;
    console.error(error);
    captureException(error);

    const errorCode = error?.response?.data?.error_code;
    const isRateLimitError = errorCode === PlaidRateLimitErrorCode;
    const isCredentialError = errorCode in PlaidCredentialErrorCode;
    const isOtherPlaidError = errorCode in PlaidErrorType;
    const status = isRateLimitError ? 429 : 500;

    return NextResponse.json<SyncResponse>(
      {
        plaidError: {
          isRateLimitError,
          isCredentialError,
          isOtherPlaidError,
        },
        hasMore: false,
      },
      { status }
    );
  }
}
