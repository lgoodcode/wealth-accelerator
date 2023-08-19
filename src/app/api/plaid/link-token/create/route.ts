import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

import { getUser } from '@/lib/supabase/server/get-user';
import { plaidClient, createLinkTokenRequest } from '@/lib/plaid/config';
import type { CreateLinkTokenResponse } from '@/lib/plaid/types/link-token';

export const dynamic = 'force-dynamic';
export const GET = createLinkToken;

async function createLinkToken() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'No user found' }, { status: 401 });
  }

  try {
    const response = await plaidClient.linkTokenCreate(createLinkTokenRequest(user.id));
    const { link_token } = response.data;
    return NextResponse.json<CreateLinkTokenResponse>({ link_token });
  } catch (error) {
    console.error(error);
    captureException(error);
    return NextResponse.json({ error: 'Failed to create link token' }, { status: 500 });
  }
}
