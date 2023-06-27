import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const requestURL = new URL(req.url);
  const code = requestURL.searchParams.get('code');
  console.log('request', code);
  if (code) {
    console.log('has code');
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }
  console.log('redirecting', `${requestURL.origin}/login`);
  return NextResponse.redirect(`${requestURL.origin}/login`);
}
