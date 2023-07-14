import { createSupabase } from '@/lib/supabase/server/createSupabase';
import { captureException } from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export const GET = getUsers;

async function getUsers() {
  const supabase = createSupabase(true);
  const { error, data: users } = await supabase
    .from('users')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error(error);
    captureException(error);
    return NextResponse.json({ error: 'Failed to retrieve users' }, { status: 500 });
  }

  return NextResponse.json({ users });
}
