import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

import { getUser } from '@/lib/supabase/server/get-user';
import { getItemFromItemId } from '@/lib/plaid/get-item-from-item-id';
import { serverSyncTransactions } from '@/lib/plaid/transactions/server-sync-transactions';
import type { SyncTransactionsResponse } from '@/lib/plaid/types/sync';

interface SyncInstitutionParams {
  params: {
    item_id: string;
  };
}

export const maxDuration = 120;
export const dynamic = 'force-dynamic';
export const GET = syncTransactions;

async function syncTransactions(_: Request, { params: { item_id } }: SyncInstitutionParams) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'No user found' }, { status: 401 });
  }

  if (!item_id) {
    return NextResponse.json({ error: 'Missing item_id' }, { status: 400 });
  }

  const { error: itemError, data: item } = await getItemFromItemId(item_id);

  if (itemError) {
    console.error(itemError);
    captureException(itemError);
    return NextResponse.json<SyncTransactionsResponse>(
      {
        hasMore: false,
        error: {
          general: 'Failed to retrieve item',
          plaid: null,
          link_token: null,
        },
      },
      { status: 500 }
    );
  }

  const { error, data } = await serverSyncTransactions(item);

  if (error) {
    const errMsg = 'Failed to sync transactions';

    console.error(errMsg, {
      item_id,
      error,
      transactions: data?.transactions,
    });
    captureException(new Error(errMsg), {
      extra: {
        item_id,
        error,
        transactions: data?.transactions,
      },
    });

    return NextResponse.json<SyncTransactionsResponse>(
      {
        hasMore: false,
        error: {
          general: error.general,
          link_token: error.link_token,
          plaid: error.plaid,
        },
      },
      { status: error.status }
    );
  }

  return NextResponse.json<SyncTransactionsResponse>({
    error: null,
    hasMore: data.hasMore,
  });
}
