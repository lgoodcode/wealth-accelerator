import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabase/server/admin';
import { getUser } from '@/lib/supabase/server/get-user';
import { captureException } from '@sentry/nextjs';

export const dynamic = 'force-dynamic';
export const DELETE = deleteUser;

async function deleteUser(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } else if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error: deleteAuthUserError } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (deleteAuthUserError) {
    console.error(deleteAuthUserError);
    captureException(deleteAuthUserError);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
