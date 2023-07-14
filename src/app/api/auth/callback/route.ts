import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export const GET = exchangeCodeForSession;

async function exchangeCodeForSession(request: Request) {
  const requestURL = new URL(request.url);
  const code = requestURL.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${requestURL.origin}/login`);
}
