import { cookies } from 'next/headers';
import jwtDecode from 'jwt-decode';

const PROJECT_ID = process.env.SUPABASE_PROJECT_ID;
const SUPABASE_AUTH_COOKIE = `sb-${PROJECT_ID}-auth-token`;

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
export const parseAuthCookie = (
  cookie = cookies().get(SUPABASE_AUTH_COOKIE)?.value
): Token | null => {
  if (!cookie || cookie === 'undefined') {
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
