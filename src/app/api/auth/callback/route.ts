import { NextRequest, NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';

import { createSupabase } from '@/lib/supabase/api';
import { formatPath } from '@/lib/utils/format-path';

export const dynamic = 'force-dynamic';
export const GET = exchangeCodeForSession;

async function exchangeCodeForSession(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get('code');
  const redirect_to = url.searchParams.get('redirect_to');
  const redirectTo: `/${string}` = redirect_to ? formatPath(redirect_to) : '/login';

  try {
    if (code) {
      const supabase = createSupabase();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        throw error;
      }
    }
  } catch (error) {
    console.error(error);
    captureException(error, {
      extra: {
        code,
      },
    });
  }

  return NextResponse.redirect(`${url.origin}${redirectTo}`);
}
