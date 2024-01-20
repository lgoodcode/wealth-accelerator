import { NextRequest, NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

import { getUser } from '@/lib/supabase/server/get-user';
import { plaidClient } from '@/lib/plaid/config';
import { getItemFromItemId } from '@/lib/plaid/get-item-from-item-id';

export const maxDuration = 120;
export const dynamic = 'force-dynamic';
export const GET = getAccountBalance;

interface GetAccountBalanceParams {
  params: {
    item_id: string;
    account_id: string;
  };
}

async function getAccountBalance(
  _: NextRequest,
  { params: { item_id, account_id } }: GetAccountBalanceParams
) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'No user found' }, { status: 401 });
  } else if (!item_id) {
    return NextResponse.json({ error: 'Missing item_id' }, { status: 400 });
  } else if (!account_id) {
    return NextResponse.json({ error: 'Missing account_id' }, { status: 400 });
  }

  const { error, data: item } = await getItemFromItemId(item_id);

  if (error) {
    console.error(error, { item_id });
    captureException(error, {
      extra: {
        item_id,
      },
    });
    return NextResponse.json({ error: 'Failed to get item' }, { status: 500 });
  }

  const { access_token } = item;

  try {
    const response = await plaidClient.accountsBalanceGet({
      access_token,
      options: {
        account_ids: [account_id],
      },
    });

    const balance = response.data.accounts[0].balances.available;

    return NextResponse.json({ balance });
  } catch (error: any) {
    const extra = {
      item_id,
      account_id,
      error: error.response,
    };

    console.error(error, extra);
    console.warn(Object.keys(error));
    captureException('Failed to retrieve account balance', { extra });
    return NextResponse.json({ error: 'Failed to retrieve account balance' }, { status: 500 });
  }
}
