import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { captureException } from '@sentry/nextjs';

import { parseAuthCookie } from '@/lib/supabase/server/parseAuthCookie';
import type { Database } from '@/lib/supabase/database';

const authPagesRegex = /^\/(login|signup|forgot-password|reset-password)/;

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isAuthPage = authPagesRegex.test(request.nextUrl.pathname);
  const supabase = createMiddlewareClient<Database>({ req: request, res });
  const token = parseAuthCookie(request.cookies);
  const loginRedirectUrl = new URL(`${request.nextUrl.origin}/login`);
  // Set the redirect_to query param to the current path
  loginRedirectUrl.searchParams.set('redirect_to', request.nextUrl.pathname);

  // If the auth token isn't valid (none or expired), redirect to login page
  // for all pages except auth pages
  if (!token) {
    if (isAuthPage) {
      return res;
    }
    return NextResponse.redirect(loginRedirectUrl);
  }

  // Refresh session to prevent expiration
  const {
    error,
    data: { session },
  } = await supabase.auth.getSession();

  if (error) {
    console.error('Middleware error', error);
    captureException(error, {
      user: {
        id: session?.user.id,
        email: session?.user.email,
        username: session?.user.user_metadata?.name,
      },
    });
  }

  const dashboardHomeRedirectUrl = new URL(`${request.nextUrl.origin}/dashboard/home`);
  dashboardHomeRedirectUrl.searchParams.set('redirect_to', request.nextUrl.pathname);

  // If there is an error or there's no session, redirect to login page for all pages except auth pages
  if ((error || !session) && !isAuthPage) {
    return NextResponse.redirect(loginRedirectUrl);
  } else if (session && isLoginPage) {
    // If there is a session and user is visiting the login page, redirect to dashboard home
    return NextResponse.redirect(dashboardHomeRedirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
