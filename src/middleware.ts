import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import jwtDecode, { type JwtPayload } from 'jwt-decode';

import type { Database } from '@/types/database';

const authPagesRegex = /^\/(login|signup|forgot-password|reset-password)/;

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const isLoginPage = req.nextUrl.pathname === '/login';
  const isAuthPage = authPagesRegex.test(req.nextUrl.pathname);
  const supabase = createMiddlewareClient<Database>({ req, res });

  // Get the auth token from the cookie, decode it, and check if it's expired
  const rawSupabaseAuthTokenCookie = req.cookies.get('sb-localhost-auth-token')?.value;
  const isInvalidAuthTokenCookie =
    !rawSupabaseAuthTokenCookie || rawSupabaseAuthTokenCookie === 'undefined';

  // If the auth token cookie is invalid, clear the cookie and redirect to login page
  if (isInvalidAuthTokenCookie) {
    res.cookies.set('sb-localhost-auth-token', '', { maxAge: -1 });

    if (isAuthPage) {
      return res;
    }
    return NextResponse.redirect(new URL(`${req.nextUrl.origin}/login`));
  }

  const supabaseAuthTokenCookie = JSON.parse(rawSupabaseAuthTokenCookie || '');
  const supabaseAuthTokenString: string | null = Array.isArray(supabaseAuthTokenCookie)
    ? supabaseAuthTokenCookie[0]
    : null;
  const supabaseAuthToken = jwtDecode<JwtPayload>(supabaseAuthTokenString || '');
  const isTokenInvalid =
    !supabaseAuthToken || Date.now() >= (supabaseAuthToken.exp as number) * 1000;

  // If the auth token isn't valid (none or expired), clear the cookie and redirect to login page
  // for all pages except auth pages
  if (isTokenInvalid) {
    res.cookies.set('sb-localhost-auth-token', '', { maxAge: -1 });

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
