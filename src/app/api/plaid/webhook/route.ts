import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';
import { getItemFromItemId } from '@/lib/plaid/getItemFromItemId';
import { serverSyncTransactions } from '@/lib/plaid/transactions/serverSyncTransactions';

export const POST = syncTransactionsWebhook;

async function syncTransactionsWebhook(req: Request) {
  const body = await req.json().catch((err) => err);

  if (!body) {
    return NextResponse.json({ error: 'Missing body' }, { status: 400 });
  } else if (body instanceof Error) {
    return NextResponse.json({ error: body.message }, { status: 400 });
  }

  console.log('Webhook received:', body);

  const { webhook_code, item_id } = body;

  switch (webhook_code) {
    // Fired when new transactions data becomes available.
    case 'SYNC_UPDATES_AVAILABLE': {
      const { error: itemError, data: item } = await getItemFromItemId(item_id, true);

      if (itemError) {
        console.error(itemError);
        captureException(itemError);

        return NextResponse.json({ error: itemError.message }, { status: 500 });
      }
      console.log('processing', item_id);
      const { error: syncError } = await serverSyncTransactions(item!, true);
      if (syncError) {
        console.error(syncError);
        captureException(syncError);

        if (syncError.general) {
          return NextResponse.json({ error: syncError.general.message }, { status: 500 });
        }

        return NextResponse.json({ error: syncError.plaid }, { status: 500 });
      }

      break;
    }

    // Ignore - not needed if using sync endpoint + webhook
    case 'DEFAULT_UPDATE':
    case 'INITIAL_UPDATE':
    case 'HISTORICAL_UPDATE':
      break;

    default:
      console.error(`Unhandled webhook type received: ${webhook_code}.`, item_id);
  }
  console.log('success', item_id);
  return NextResponse.json({ success: true });
}
