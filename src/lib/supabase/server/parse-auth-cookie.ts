import jwtDecode from 'jwt-decode';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

const PROJECT_ID = process.env.SUPABASE_PROJECT_ID;

/** Partial of the values contained in the Supabase JWT in the cookies */
type Token = {
  exp: number;
  /** id */
  sub: string;
  email: string;
  user_metadata: { name: string };
  role: string;
};

/**
 * Parses the Supabase auth cookie and returns the token and whether it's expired
 * or `null` if the cookie is invalid
 *
 * Can only be used in middleware or on the server.
 */
export const parseAuthCookie = (cookies: RequestCookies | ReadonlyRequestCookies) => {
  const cookie = cookies.get(`sb-${PROJECT_ID}-auth-token`)?.value;
  const isInvalidCookie = !cookie || cookie === 'undefined';

  if (isInvalidCookie) {
    return null;
  }

  const supabaseAuthTokenCookie = JSON.parse(cookie || '');
  const supabaseAuthTokenString: string | null = Array.isArray(supabaseAuthTokenCookie)
    ? supabaseAuthTokenCookie[0]
    : null;

  if (!supabaseAuthTokenString) {
    return null;
  }

  const supabaseAuthToken = jwtDecode<Token>(supabaseAuthTokenString);
  const expired = Date.now() >= (supabaseAuthToken?.exp || Infinity) * 1000;

  if (expired) {
    return null;
  }

  return supabaseAuthToken;
};
