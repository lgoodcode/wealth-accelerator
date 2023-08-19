import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

import { createSupabase } from '@/lib/supabase/api';

export const dynamic = 'force-dynamic';
export const GET = exchangeCodeForSession;

async function exchangeCodeForSession(request: Request) {
  const requestURL = new URL(request.url);
  const code = requestURL.searchParams.get('code');
  const redirectTo = requestURL.searchParams.get('redirect_to') ?? '/login';

  try {
    if (code) {
      const supabase = createSupabase();
      await supabase.auth.exchangeCodeForSession(code);
    }
  } catch (error) {
    console.error(error);
    captureException(error, {
      extra: {
        code,
      },
    });
  }

  return NextResponse.redirect(`${requestURL.origin}${redirectTo}`);
}
