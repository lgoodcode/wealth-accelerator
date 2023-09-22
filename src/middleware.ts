import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { captureException } from '@sentry/nextjs';

import { parseAuthCookie } from '@/lib/supabase/server/parse-auth-cookie';
import type { Database } from '@/lib/supabase/database';

const PROJECT_ID = process.env.SUPABASE_PROJECT_ID;
const authPagesRegex = /^\/(login|signup|forgot-password|reset-password)/;

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isAuthPage = authPagesRegex.test(request.nextUrl.pathname);
  const supabase = createMiddlewareClient<Database>({ req: request, res });
  const token = parseAuthCookie(request.cookies);
  const queryEntries = request.nextUrl.search ? request.nextUrl.search.substring(1) : '';
  const loginRedirectUrl = new URL(
    isLoginPage && queryEntries.startsWith('redirect_to') // Don't redirect to login page if already on login page
      ? `${request.nextUrl.origin}/login?${queryEntries}`
      : `${request.nextUrl.origin}/login?redirect_to=${request.nextUrl.pathname}${
          queryEntries ? `&${queryEntries}` : ''
        }`
  );

  // If the auth token isn't valid (none or expired), destory the session cookie and
  // redirect to login page for all pages except auth pages
  if (!token) {
    request.cookies.set({
      name: `sb-${PROJECT_ID}-auth-token`,
      value: '',
    });

    if (isAuthPage) {
      return res;
    }
    return NextResponse.redirect(loginRedirectUrl);
  }

  // Refresh session to prevent expiration
  const {
    error: sessionError,
    data: { session },
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('Middleware session error', sessionError);
    captureException(sessionError, {
      user: {
        id: token.sub,
        email: token.email,
        username: token.user_metadata.name,
      },
    });
  }

  if (!session) {
    return NextResponse.redirect(loginRedirectUrl);
  }

  // Get the user to make sure they are authenticated
  const {
    error: userError,
    data: { user },
  } = await supabase.auth.getUser();

  if (userError) {
    console.error('Middleware user error', userError);
    captureException(userError, {
      user: {
        id: session.user.id,
        email: session.user.email,
        username: session.user.user_metadata?.name,
      },
    });
  }

  // If there is an error or there's no session, redirect to login page for all pages except auth pages
  if ((userError || !user) && !isAuthPage) {
    return NextResponse.redirect(loginRedirectUrl);
  } else if (user && isLoginPage) {
    // If there is a session and user is visiting the login page, redirect to dashboard home
    return NextResponse.redirect(new URL(`${request.nextUrl.origin}/dashboard/home`));
  }

  return res;
}

export const config = {
  matcher: ['/login', '/reset-password', '/dashboard/:path*'],
};
