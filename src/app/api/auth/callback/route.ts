import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

export const GET = exchangeCodeForSession;

async function exchangeCodeForSession(request: Request) {
  const requestURL = new URL(request.url);
  const code = requestURL.searchParams.get('code');
  const redirectTo = requestURL.searchParams.get('redirect_to') ?? '/login';

  console.log('exchange', { code, redirectTo });

  try {
    if (code) {
      const supabase = createRouteHandlerClient({ cookies });
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
