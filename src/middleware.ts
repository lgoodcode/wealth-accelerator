import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { captureException } from '@sentry/nextjs';

import { parseAuthCookie } from '@/lib/supabase/server/parseAuthCookie';
import type { Database } from '@/types/database';

const authPagesRegex = /^\/(login|signup|forgot-password|reset-password)/;

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const isLoginPage = req.nextUrl.pathname === '/login';
  const isAuthPage = authPagesRegex.test(req.nextUrl.pathname);
  const supabase = createMiddlewareClient<Database>({ req, res });
  const token = parseAuthCookie(req.cookies);
  // If the auth token isn't valid (none or expired), redirect to login page
  // for all pages except auth pages
  if (!token) {
    if (isAuthPage) {
      return res;
    }
    return NextResponse.redirect(new URL(`${req.nextUrl.origin}/login`));
  }

  // Refresh session to prevent expiration
  const {
    error,
    data: { session },
  } = await supabase.auth.getSession();

  if (error) {
    console.error('Middleware error', error);
    captureException(error);
  }

  // If there is an error or there's no session, redirect to login page for all pages except auth pages
  if ((error || !session) && !isAuthPage) {
    return NextResponse.redirect(new URL(`${req.nextUrl.origin}/login`));
  } else if (session && isLoginPage) {
    // If there is a session and user is visiting the login page, redirect to dashboard home
    return NextResponse.redirect(new URL(`${req.nextUrl.origin}/dashboard/home`));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
