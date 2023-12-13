/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

import { getUser } from '@/lib/supabase/server/get-user';
import { JsonParseApiRequest } from '@/lib/utils/json-parse-api-request';
import { createSupabase } from '@/lib/supabase/api';
import type { PlaidInstitutionsAddBody } from '@/lib/plaid/types/link-token';

export const dynamic = 'force-dynamic';
export const POST = PlaidAccountsAdd;

async function PlaidAccountsAdd(request: Request) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'No user found' }, { status: 401 });
  }

  const body = await JsonParseApiRequest<PlaidInstitutionsAddBody>(request);

  if (body instanceof Error) {
    return NextResponse.json({ error: body.message }, { status: 400 });
  } else if (!body.item_id) {
    return NextResponse.json({ error: 'Missing item_id' }, { status: 400 });
  } else if (!body.accounts) {
    return NextResponse.json({ error: 'Missing institutions' }, { status: 400 });
  } else if (!body.accounts.length) {
    return NextResponse.json({ error: 'No institutions found' }, { status: 400 });
  }

  const supabase = createSupabase();
  const { error } = await supabase.rpc('add_plaid_accounts', {
    item_id: body.item_id,
    accounts: body.accounts,
  });

  if (error) {
    console.error(error);
    captureException(error);
    return NextResponse.json({ error: 'Failed to add accounts' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
