import { getItemFromItemId } from '@/lib/plaid/getItemFromItemId';
import { serverSyncTransactions } from '@/lib/plaid/transactions/serverSyncTransactions';
import { SyncTransactionsResponse } from '@/lib/plaid/types/sync';
import { captureException } from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
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
        const { error: itemError, data: item } = await getItemFromItemId(item_id, true);

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

        const { error } = await serverSyncTransactions(item!, true);

        if (error) {
          console.error(error);
          captureException(error);
        }

        break;
      }

      case 'DEFAULT_UPDATE':
      case 'INITIAL_UPDATE':
      case 'HISTORICAL_UPDATE':
        // Ignore - not needed if using sync endpoint + webhook
        break;

      default:
        console.error(`Unhandled webhook type received: ${webhook_code}.`, item_id);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err as Error;
    console.error(error);
    captureException(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
