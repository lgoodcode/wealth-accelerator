import { NextResponse } from 'next/server';

import { createSupabase } from '@/lib/supabase/api';
import { captureException } from '@sentry/nextjs';

export const dynamic = 'force-dynamic';
export const DELETE = deleteUser;

async function deleteUser(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const supabase = createSupabase();
  const { error: deleteUserError } = await supabase.from('users').delete().eq('id', id);
  const { error: deleteAuthUserError } = await supabase.auth.admin.deleteUser(id);

  if (deleteUserError || deleteAuthUserError) {
    const error = deleteUserError || deleteAuthUserError;
    console.error(error);
    captureException(error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
