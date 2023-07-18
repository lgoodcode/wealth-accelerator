import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

import { getUser } from '@/lib/supabase/server/getUser';
import { getItemFromItemId } from '@/lib/plaid/getItemFromItemId';
import { serverSyncTransactions } from '@/lib/plaid/transactions/serverSyncTransactions';
import type { SyncTransactionsResponse } from '@/lib/plaid/types/sync';

interface SyncInstitutionParams {
  params: {
    item_id: string;
  };
}

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
        error: {
          general: new Error('Failed to retrieve item'),
          plaid: null,
        },
      },
      { status: 500 }
    );
  }

  const { error, data } = await serverSyncTransactions(item);

  if (error) {
    console.error(error);
    captureException(error, {
      extra: {
        item_id,
        transactions: JSON.stringify(data?.transactions),
      },
    });
    return NextResponse.json<SyncTransactionsResponse>(
      {
        error: {
          general: new Error('Failed to sync transactions'),
          plaid: error.plaid,
        },
      },
      { status: error.status }
    );
  }

  return NextResponse.json<SyncTransactionsResponse>({ hasMore: data.hasMore });
}
