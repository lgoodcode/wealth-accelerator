import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

import { JsonParseApiRequest } from '@/lib/utils/json-parse-api-request';
import { getItemFromItemId } from '@/lib/plaid/get-item-from-item-id';
import { serverSyncTransactions } from '@/lib/plaid/transactions/server-sync-transactions';
import { supabaseAdmin } from '@/lib/supabase/server/admin';

export const dynamic = 'force-dynamic';
export const POST = syncTransactionsWebhook;

async function syncTransactionsWebhook(request: Request) {
  const body = await JsonParseApiRequest(request);

  if (!body) {
    return NextResponse.json({ error: 'Missing body' }, { status: 400 });
  } else if (body instanceof Error) {
    return NextResponse.json({ error: body.message }, { status: 400 });
  }

  console.log('Webhook received:', body);

  const { webhook_code, item_id } = body;

  switch (webhook_code) {
    // Fired when new transactions data becomes available.
    case 'SYNC_UPDATES_AVAILABLE':
    // Fired when an item has exited the ITEM_LOGIN_REQUIRED state without any action required by the user.
    case 'LOGIN_REPAIRED': {
      const { error: itemError, data: item } = await getItemFromItemId(item_id, true);

      if (itemError || !item) {
        const error = itemError || new Error(`No data returned for item_id: ${item_id}`);
        console.error(error);
        captureException(error, {
          extra: { item_id },
        });

        return NextResponse.json({ error: itemError.message }, { status: 500 });
      }

      const { error: syncError } = await serverSyncTransactions(item);

      if (syncError) {
        if (syncError.general) {
          return NextResponse.json({ error: syncError.general.message }, { status: 500 });
        }

        return NextResponse.json({ error: syncError.plaid }, { status: 500 });
      }

      break;
    }

    case 'TRANSACTIONS_REMOVED': {
      const removed_transactions = body.removed_transactions as string[];
      const { error } = await supabaseAdmin
        .from('plaid_transactions')
        .delete()
        .in('id', removed_transactions);

      if (error) {
        console.error(error);
        captureException(error, {
          extra: {
            item_id,
            removed_transactions,
          },
        });

        return NextResponse.json({ error: 'Failed to remove transactions' }, { status: 500 });
      }

      break;
    }

    case 'ERROR': {
      console.error(body.error);
      captureException(body.error, {
        extra: { item_id },
      });

      break;
    }

    // Ignore - not needed if using sync endpoint + webhook
    case 'DEFAULT_UPDATE':
    case 'INITIAL_UPDATE':
    case 'HISTORICAL_UPDATE':
      break;

    default:
      console.error(`Unhandled webhook type received: ${webhook_code}.`, item_id);
      captureException(new Error(`Unhandled webhook type received: ${webhook_code}.`), {
        extra: { item_id },
      });
  }

  return NextResponse.json({ success: true });
}
