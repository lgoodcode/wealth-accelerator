/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

import { getUser } from '@/lib/supabase/server/get-user';
import { getItemFromItemId } from '@/lib/plaid/get-item-from-item-id';
import { createLinkToken } from '@/lib/plaid/create-link-token';
import type { CreateLinkTokenResponse } from '@/lib/plaid/types/link-token';

export const dynamic = 'force-dynamic';
export const GET = CreateLinkToken;

async function CreateLinkToken(request: Request) {
  const { searchParams } = new URL(request.url);
  const user = await getUser();
  const item_id = searchParams.get('item_id');

  if (!user) {
    return NextResponse.json({ error: 'No user found' }, { status: 401 });
  }

  try {
    if (item_id) {
      const item = await getItemFromItemId(item_id);

      if (item.error) {
        throw item.error;
      }

      const link_token = await createLinkToken(user.id, item.data.access_token);
      return NextResponse.json<CreateLinkTokenResponse>({ link_token });
    }

    const link_token = await createLinkToken(user.id);
    return NextResponse.json<CreateLinkTokenResponse>({ link_token });
  } catch (error) {
    console.error(error);
    captureException(error);
    return NextResponse.json({ error: 'Failed to create link token' }, { status: 500 });
  }
}
