import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { captureException } from '@sentry/nextjs';

import { parseAuthCookie } from '@/lib/supabase/server/parseAuthCookie';
import type { Database } from '@/lib/supabase/database';

const authPagesRegex = /^\/(login|signup|forgot-password|reset-password)/;

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const isLoginPage = req.nextUrl.pathname === '/login';
  const isAuthPage = authPagesRegex.test(req.nextUrl.pathname);
  const supabase = createMiddlewareClient<Database>({ req, res });
  const token = parseAuthCookie(req.cookies);
  const loginRedirectUrl = new URL(`${req.nextUrl.origin}/login`);
  // Set the redirect_to query param to the current path
  loginRedirectUrl.searchParams.set('redirect_to', req.nextUrl.pathname);

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

  const dashboardHomeRedirectUrl = new URL(`${req.nextUrl.origin}/dashboard/home`);
  dashboardHomeRedirectUrl.searchParams.set('redirect_to', req.nextUrl.pathname);

  // If there is an error or there's no session, redirect to login page for all pages except auth pages
  if ((error || !session) && !isAuthPage) {
    return NextResponse.redirect(loginRedirectUrl);
  } else if (session && isLoginPage) {
    // If there is a session and user is visiting the login page, redirect to dashboard home
    return NextResponse.redirect(dashboardHomeRedirectUrl);
  }

  // Check if the path is an admin path and if the user is an admin
  const isAdminPath = req.nextUrl.pathname.startsWith('/dashboard/admin');
  const isAdmin = session?.user.role === 'admin';

  // If the path is an admin path and the user is not an admin, redirect to dashboard home
  if (isAdminPath && !isAdmin) {
    return NextResponse.redirect(dashboardHomeRedirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
