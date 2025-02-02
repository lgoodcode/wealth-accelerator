import { captureException } from '@sentry/nextjs';
import { NextResponse } from 'next/server';

import { getUser } from '@/lib/supabase/server/get-user';
import { JsonParseApiRequest } from '@/lib/utils/json-parse-api-request';
import { createSupabase } from '@/lib/supabase/api';
import { plaidClient } from '@/lib/plaid/config';
import type {
  ExchangeLinkTokenBody,
  ExchangeLinkTokenResponse,
} from '@/lib/plaid/types/link-token';
import { AccountType } from '@/lib/plaid/types/institutions';

export const dynamic = 'force-dynamic';
export const POST = exchangeLinkToken;

async function exchangeLinkToken(request: Request) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'No user found' }, { status: 401 });
  }

  const body = await JsonParseApiRequest<ExchangeLinkTokenBody>(request);

  if (body instanceof Error) {
    return NextResponse.json({ error: body.message }, { status: 400 });
  } else if (!body.public_token) {
    return NextResponse.json({ error: 'Missing public_token' }, { status: 400 });
  } else if (!body.metadata) {
    return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
  }

  const supabase = createSupabase();
  const { public_token, metadata } = body;
  const institution_name = metadata?.institution?.name || 'Unknown Institution';
  // Exchange the public token for an access token
  try {
    const {
      data: { item_id, access_token },
    } = await plaidClient.itemPublicTokenExchange({ public_token });
    // Expire the access token in 90 days minus 60 seconds
    const expiration = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000 - 60 * 1000).toUTCString();

    // Check if the insitution already exists in the database for the user, if so, add a number to the end
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

    // Store the institution in the database and select it
    const { error: insertInstitutionError, data: item } = await supabase
      .from('plaid')
      .insert({
        item_id,
        user_id: user.id,
        name: count > 0 ? `${institution_name} (${count})` : institution_name,
        expiration,
        access_token,
      })
      .select('item_id, name, cursor, expiration, new_accounts')
      .single();

    if (insertInstitutionError ?? !item) {
      const error = insertInstitutionError || new Error('No data returned from insert');
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
          type: 'business' as AccountType,
        }))
      );

      if (error) {
        console.error(error);
        captureException(error);
        return NextResponse.json({ error: 'Error storing accounts' }, { status: 500 });
      }
    }

    return NextResponse.json<ExchangeLinkTokenResponse>({ item });
  } catch (error) {
    console.error(error);
    captureException(error);
    return NextResponse.json({ error: 'Error exchanging public token' }, { status: 500 });
  }
}
