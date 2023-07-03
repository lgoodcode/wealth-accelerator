import { getItemFromItemId } from '@/lib/plaid/getItemFromItemId';
import { serverSyncTransactions } from '@/lib/plaid/transactions/serverSyncTransactions';
import { SyncTransactionsResponse } from '@/lib/plaid/types/sync';
import { captureException } from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json().catch((err) => err);

  if (!body) {
    return NextResponse.json({ error: 'Missing body' }, { status: 400 });
  } else if (body instanceof Error) {
    return NextResponse.json({ error: body.message }, { status: 400 });
  }

  console.log('webhook body', body);
  const { webhook_code, item_id } = body;

  switch (webhook_code) {
    // Fired when new transactions data becomes available.
    case 'SYNC_UPDATES_AVAILABLE': {
      const { error: itemError, data: item } = await getItemFromItemId(item_id);

      if (itemError) {
        console.error(itemError);
        captureException(itemError);
        return NextResponse.json<SyncTransactionsResponse>(
          {
            error: {
              general: itemError,
              plaid: null,
            },
          },
          { status: 500 }
        );
      }

      const { error } = await serverSyncTransactions(item);

      if (error) {
        console.error(error);
        captureException(error);
      }

      break;
    }
    case 'DEFAULT_UPDATE':
    case 'INITIAL_UPDATE':
    case 'HISTORICAL_UPDATE':
      /* ignore - not needed if using sync endpoint + webhook */
      break;
    default:
      console.error(`Unhandled webhook type received: ${webhook_code}.`, item_id);
  }
}
