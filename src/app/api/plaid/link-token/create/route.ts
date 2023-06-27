import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

import { getUser } from '@/lib/supabase/server/getUser';
import { client, createLinkTokenRequest } from '@/lib/plaid/config';
import type { CreateLinkTokenResponse } from '@/lib/plaid/types/link-token';

export async function GET() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'No user found' }, { status: 401 });
  }

  try {
    const response = await client.linkTokenCreate(createLinkTokenRequest(user.id));
    const { link_token } = response.data;
    return NextResponse.json<CreateLinkTokenResponse>({ link_token });
  } catch (err) {
    console.error(err);
    captureException(err);
    return NextResponse.json({ error: 'Failed to create link token' }, { status: 500 });
  }
}
