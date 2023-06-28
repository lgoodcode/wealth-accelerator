import { captureException } from '@sentry/nextjs';
import { NextResponse } from 'next/server';

import { getUser } from '@/lib/supabase/server/getUser';
import { createSupabase } from '@/lib/supabase/server/createSupabase';
import { plaidClient } from '@/lib/plaid/config';
import type { ExchangeLinkTokenBody } from '@/lib/plaid/types/link-token';

export async function POST(req: Request) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'No user found' }, { status: 401 });
  }

  // Validate the request body
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { public_token, metadata } = body as ExchangeLinkTokenBody;

  if (!public_token) {
    return NextResponse.json({ error: 'Missing public_token' }, { status: 400 });
  } else if (!metadata) {
    return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
  }

  const supabase = createSupabase();
  const institution_name = metadata?.institution?.name || 'Unknown Institution';
  // Exchange the public token for an access token
  try {
    const {
      data: { item_id, access_token },
    } = await plaidClient.itemPublicTokenExchange({ public_token });
    // Expire the access token in 90 days minus 60 seconds
    const expiration = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000 - 60 * 1000).toUTCString();

    // Check if the insitution already exists in the database, if so, add a number to the end
    const { data: existingInstitutions } = await supabase
      .from('plaid')
      .select('name')
      .eq('user_id', user.id);

    const count = !existingInstitutions
      ? 0
      : existingInstitutions.reduce(
          (count, ins) => count + (ins.name.includes(institution_name) ? 1 : 0),
          0
        );

    // Store the institution in the database
    const { error } = await supabase.from('plaid').insert({
      item_id,
      user_id: user.id,
      name: count > 0 ? `${institution_name} (${count})` : institution_name,
      expiration,
      access_token,
    });

    if (error) {
      console.error(error);
      captureException(error);
      return NextResponse.json({ error: 'Error storing institution' }, { status: 500 });
    }

    // Store the accounts in the database
    if (metadata.accounts.length) {
      const { error } = await supabase.from('plaid_accounts').insert(
        metadata.accounts.map((account) => ({
          account_id: account.id,
          item_id,
          name: account.name,
        }))
      );

      if (error) {
        console.error(error);
        captureException(error);
        return NextResponse.json({ error: 'Error storing accounts' }, { status: 500 });
      }
    }

    return NextResponse.json({ item_id });
    // Catch the error if the exchange fails
  } catch (error) {
    console.error(error);
    captureException(error);
    return NextResponse.json({ error: 'Error exchanging public token' }, { status: 500 });
  }
}
