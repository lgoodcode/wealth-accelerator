import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

import { getUser } from '@/lib/supabase/server/getUser';
import { plaidClient } from '@/lib/plaid/config';
import { getItemFromItemId } from '@/lib/plaid/getItemFromItemId';

interface RemoveInstitutionParams {
  params: {
    item_id: string;
  };
}

export async function DELETE(_: Request, { params: { item_id } }: RemoveInstitutionParams) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'No user found' }, { status: 401 });
  }

  // Verify the parameters
  if (!item_id) {
    return NextResponse.json({ error: 'Missing item_id' }, { status: 400 });
  }

  const { error, data: item } = await getItemFromItemId(item_id);

  if (error) {
    console.error(error);
    captureException(error);
    return NextResponse.json({ error }, { status: 500 });
  }

  // Revoke the access token
  try {
    await plaidClient.itemRemove({ access_token: item.access_token });
  } catch (error) {
    console.error(error);
    captureException(error);
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
