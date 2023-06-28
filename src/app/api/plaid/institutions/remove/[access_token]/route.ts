import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

import { getUser } from '@/lib/supabase/server/getUser';
import { plaidClient } from '@/lib/plaid/config';

interface RenameParams {
  params: {
    access_token: string;
  };
}

export async function DELETE(_: any, { params: { access_token } }: RenameParams) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'No user found' }, { status: 401 });
  }

  // Verify the parameters
  if (!access_token) {
    return NextResponse.json({ error: 'Missing access_token' }, { status: 400 });
  }

  // Revoke the access token
  try {
    await plaidClient.itemRemove({ access_token });
  } catch (error) {
    console.error(error);
    captureException(error);
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
