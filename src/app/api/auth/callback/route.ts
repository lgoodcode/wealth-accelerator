import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

import { createSupabase } from '@/lib/supabase/api';
import { formatPath } from '@/lib/utils/format-path';

export const dynamic = 'force-dynamic';
export const GET = exchangeCodeForSession;

async function exchangeCodeForSession(request: Request) {
  const requestURL = new URL(request.url);
  const code = requestURL.searchParams.get('code');
  const redirectTo: `/${string}` =
    formatPath(requestURL.searchParams.get('redirect_to')) ?? '/login';

  try {
    if (code) {
      const supabase = createSupabase();
      const {
        error,
        data: { session },
      } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        throw error;
      }

      if (redirectTo === '/reset-password') {
        return NextResponse.redirect(
          `${requestURL.origin}${redirectTo}#access_token=${session?.access_token}&refresh_token=${session?.refresh_token}`
        );
      }
      return NextResponse.redirect(`${requestURL.origin}${redirectTo}`);
    }
  } catch (error) {
    console.error(error);
    captureException(error, {
      extra: {
        code,
      },
    });

    return NextResponse.redirect(`${requestURL.origin}/login`);
  }
}
